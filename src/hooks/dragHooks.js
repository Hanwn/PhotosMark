import { defineCanvasConfig } from "@/store/defineCanvasConfig";

const {
  mainImgConfig,
  bannerRectConfig,
  blurRectConfig,
  deviceInfoConfig,
  lensInfoConfig,
  iconInfoConfig,
  verticalBarInfoConfig,
  parameterInfoConfig,
  timeInfoConfig,
  previewGroupConfig,
  alignLineOneThirdConfig,
  alignLineMiddleConfig,
  alignLineTwoThirdConfig,
  alignLineVerticalConfig,
  equalGapLineConfigs,
} = defineCanvasConfig();

const editable = {
  mainImg: mainImgConfig,
  blurRectConfig,
  deviceInfo: deviceInfoConfig,
  lensInfo: lensInfoConfig,
  iconInfo: iconInfoConfig,
  verticalBarInfo: verticalBarInfoConfig,
  parameterInfo: parameterInfoConfig,
  timeInfo: timeInfoConfig,
};

function useCanvasDrag(previewScale) {
  let active = null;

  function hideGuides() {
    alignLineOneThirdConfig.visible = false;
    alignLineMiddleConfig.visible = false;
    alignLineTwoThirdConfig.visible = false;
    alignLineVerticalConfig.visible = false;
    for (const line of equalGapLineConfigs) line.visible = false;
  }

  function getGuides(node) {
    const left = mainImgConfig.x;
    const width = mainImgConfig.image?.width || bannerRectConfig.width;
    const bottom = bannerRectConfig.y + bannerRectConfig.height;
    const top = mainImgConfig.y;
    const third = bannerRectConfig.height / 3;
    const horizontal = [
      [bannerRectConfig.y + third, "center"],
      [bannerRectConfig.y + bannerRectConfig.height / 2, "center"],
      [bannerRectConfig.y + third * 2, "center"],
      [top + (bannerRectConfig.y - top) / 2, "center"],
    ];
    const vertical = [[left, "start"], [left + width / 2, "center"], [left + width, "end"]];

    // Text should also align with the other visible rows, regardless of theme.
    if (node.getClassName() === "Text") {
      for (const peer of node.getParent().find("Text")) {
        if (peer === node || !peer.visible() || !peer.text()) continue;
        const rect = peer.getClientRect({ relativeTo: node.getParent(), skipShadow: true });
        horizontal.push([rect.y, "start"], [rect.y + rect.height / 2, "center"], [rect.y + rect.height, "end"]);
        vertical.push([rect.x, "start"], [rect.x + rect.width / 2, "center"], [rect.x + rect.width, "end"]);
      }
    }
    const spacingPeers = node.getParent().getChildren()
      .filter((peer) => peer !== node &&
        ["deviceInfo", "lensInfo", "iconInfo", "verticalBarInfo", "parameterInfo", "timeInfo"].includes(peer.name()) &&
        peer.visible() && (peer.getClassName() !== "Text" || peer.text()))
      .map((peer) => peer.getClientRect({ relativeTo: node.getParent(), skipShadow: true }));
    return {
      horizontal: horizontal.map(([y, edge]) => [alignLineMiddleConfig, y, edge]),
      vertical: vertical.map(([x, edge]) => [alignLineVerticalConfig, x, edge]),
      spacingPeers, left, width, top, bottom,
    };
  }

  function equalGap(rect, axis, guides, threshold) {
    const horizontal = axis === "x";
    const start = horizontal ? rect.x : rect.y;
    const size = horizontal ? rect.width : rect.height;
    const crossStart = horizontal ? rect.y : rect.x;
    const crossEnd = crossStart + (horizontal ? rect.height : rect.width);
    let before = horizontal ? guides.left : bannerRectConfig.y;
    let after = horizontal ? guides.left + guides.width : bannerRectConfig.y + bannerRectConfig.height;
    if (start < before - threshold || start + size > after + threshold) return null;

    for (const peer of guides.spacingPeers) {
      const peerCrossStart = horizontal ? peer.y : peer.x;
      const peerCrossEnd = peerCrossStart + (horizontal ? peer.height : peer.width);
      if (peerCrossStart >= crossEnd || peerCrossEnd <= crossStart) continue;
      const peerStart = horizontal ? peer.x : peer.y;
      const peerEnd = peerStart + (horizontal ? peer.width : peer.height);
      if (peerEnd <= start + threshold) before = Math.max(before, peerEnd);
      if (peerStart >= start + size - threshold) after = Math.min(after, peerStart);
    }

    const gap = (after - before - size) / 2;
    const delta = before + gap - start;
    return gap > 0 && Math.abs(delta) <= threshold
      ? { delta, segments: [[before, before + gap], [after - gap, after]] }
      : null;
  }

  function repeatedGap(rect, axis, guides, threshold) {
    const horizontal = axis === "x";
    const start = horizontal ? rect.x : rect.y;
    const size = horizontal ? rect.width : rect.height;
    const crossStart = horizontal ? rect.y : rect.x;
    const crossEnd = crossStart + (horizontal ? rect.height : rect.width);
    const peers = guides.spacingPeers
      .filter((peer) => {
        const peerStart = horizontal ? peer.y : peer.x;
        const peerEnd = peerStart + (horizontal ? peer.height : peer.width);
        return peerStart < crossEnd && peerEnd > crossStart;
      })
      .map((peer) => {
        const peerStart = horizontal ? peer.x : peer.y;
        return { start: peerStart, end: peerStart + (horizontal ? peer.width : peer.height) };
      })
      .sort((a, b) => a.start - b.start);

    let nearest = null;
    for (let index = 0; index < peers.length - 1; index++) {
      const first = peers[index];
      const second = peers[index + 1];
      const gap = second.start - first.end;
      if (gap <= 0) continue;
      const beforeStart = first.start - gap - size;
      const afterStart = second.end + gap;
      for (const candidate of [
        { delta: beforeStart - start, segments: [[beforeStart + size, first.start], [first.end, second.start]] },
        { delta: afterStart - start, segments: [[first.end, second.start], [second.end, afterStart]] },
      ]) {
        if (Math.abs(candidate.delta) <= threshold &&
            (!nearest || Math.abs(candidate.delta) < Math.abs(nearest.delta))) {
          nearest = candidate;
        }
      }
    }
    return nearest;
  }

  function closestGap(rect, axis, guides, threshold) {
    const between = equalGap(rect, axis, guides, threshold);
    const repeated = repeatedGap(rect, axis, guides, threshold);
    return repeated && (!between || Math.abs(repeated.delta) <= Math.abs(between.delta))
      ? repeated : between;
  }

  function closestDelta(anchors, guides, threshold) {
    let delta = null;
    let match = null;
    let matchValue = null;
    for (const [guide, value, edge] of guides) {
      for (const [anchor, anchorEdge] of anchors) {
        if (edge !== anchorEdge) continue;
        const candidate = value - anchor;
        if (Math.abs(candidate) <= threshold &&
            (delta === null || Math.abs(candidate) < Math.abs(delta))) {
          delta = candidate;
          match = guide;
          matchValue = value;
        }
      }
    }
    return { delta, match, matchValue };
  }

  function snap(node) {
    const rect = node.getClientRect({ relativeTo: node.getParent(), skipShadow: true });
    const threshold = 9 / Math.max(0.01, previewGroupConfig.scaleX * previewScale.value);
    const x = closestDelta(
      [[rect.x, "start"], [rect.x + rect.width / 2, "center"], [rect.x + rect.width, "end"]],
      active.guides.vertical,
      threshold,
    );
    const y = closestDelta(
      [[rect.y, "start"], [rect.y + rect.height / 2, "center"], [rect.y + rect.height, "end"]],
      active.guides.horizontal,
      threshold,
    );
    const canSpace = ["deviceInfo", "lensInfo", "iconInfo", "verticalBarInfo", "parameterInfo", "timeInfo"].includes(node.name());
    const xGap = canSpace ? closestGap(rect, "x", active.guides, threshold) : null;
    const yGap = canSpace ? closestGap(rect, "y", active.guides, threshold) : null;
    const useXGap = xGap && (x.delta === null || Math.abs(xGap.delta) <= Math.abs(x.delta));
    const useYGap = yGap && (y.delta === null || Math.abs(yGap.delta) <= Math.abs(y.delta));
    node.position({
      x: node.x() + (useXGap ? xGap.delta : x.delta || 0),
      y: node.y() + (useYGap ? yGap.delta : y.delta || 0),
    });
    hideGuides();
    if (!useXGap && x.match) {
      x.match.points = [x.matchValue, active.guides.top, x.matchValue, active.guides.bottom];
      x.match.visible = true;
    }
    if (!useYGap && y.match) {
      y.match.points = [active.guides.left, y.matchValue, active.guides.left + active.guides.width, y.matchValue];
      y.match.visible = true;
    }
    if (useXGap || useYGap) {
      const snapped = node.getClientRect({ relativeTo: node.getParent(), skipShadow: true });
      if (useXGap) {
        const lineY = snapped.y + snapped.height / 2;
        equalGapLineConfigs[0].points = [xGap.segments[0][0], lineY, xGap.segments[0][1], lineY];
        equalGapLineConfigs[1].points = [xGap.segments[1][0], lineY, xGap.segments[1][1], lineY];
        equalGapLineConfigs[0].visible = true;
        equalGapLineConfigs[1].visible = true;
      }
      if (useYGap) {
        const lineX = snapped.x + snapped.width / 2;
        equalGapLineConfigs[2].points = [lineX, yGap.segments[0][0], lineX, yGap.segments[0][1]];
        equalGapLineConfigs[3].points = [lineX, yGap.segments[1][0], lineX, yGap.segments[1][1]];
        equalGapLineConfigs[2].visible = true;
        equalGapLineConfigs[3].visible = true;
      }
    }
  }

  function keepInsideCanvas(node, stage, parent) {
    const inverse = parent.getAbsoluteTransform().copy().invert();
    const topLeft = inverse.point({ x: 0, y: 0 });
    const bottomRight = inverse.point({ x: stage.width(), y: stage.height() });
    const left = Math.min(topLeft.x, bottomRight.x);
    const right = Math.max(topLeft.x, bottomRight.x);
    const top = Math.min(topLeft.y, bottomRight.y);
    const bottom = Math.max(topLeft.y, bottomRight.y);
    const rect = node.getClientRect({ relativeTo: parent, skipShadow: true });
    const x = rect.width > right - left
      ? left - rect.x
      : rect.x < left ? left - rect.x : Math.min(0, right - rect.x - rect.width);
    const y = rect.height > bottom - top
      ? top - rect.y
      : rect.y < top ? top - rect.y : Math.min(0, bottom - rect.y - rect.height);
    if (x || y) {
      node.position({ x: node.x() + x, y: node.y() + y });
      hideGuides();
    }
  }

  function localPointer(stage, parent, event) {
    stage.setPointersPositions(event);
    const pointer = stage.getPointerPosition();
    return parent.getAbsoluteTransform().copy().invert().point(pointer);
  }

  function onPointerDown(e) {
    const config = editable[e.target.name()];
    if (!config || config.visible === false || (e.evt.button !== undefined && e.evt.button !== 0)) return;
    const node = e.target;
    const stage = node.getStage();
    const parent = node.getParent();
    const point = localPointer(stage, parent, e.evt);
    active = {
      node, stage, parent, config,
      offsetX: point.x - node.x(),
      offsetY: point.y - node.y(),
      guides: getGuides(node),
    };
    stage.container().style.cursor = "grabbing";
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    e.evt.preventDefault();
  }

  function onPointerMove(event) {
    if (!active) return;
    const point = localPointer(active.stage, active.parent, event);
    active.node.position({ x: point.x - active.offsetX, y: point.y - active.offsetY });
    snap(active.node);
    keepInsideCanvas(active.node, active.stage, active.parent);
    active.config.x = active.node.x();
    active.config.y = active.node.y();
    active.stage.container().style.cursor = "grabbing";
    active.node.getLayer().batchDraw();
    event.preventDefault();
  }

  function onPointerUp() {
    if (active) active.stage.container().style.cursor = "";
    hideGuides();
    active = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  }

  return { onPointerDown, onPointerUp };
}

export { useCanvasDrag };
