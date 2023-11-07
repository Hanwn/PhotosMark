
function getInitData() {
    return {
        previewStageConfig:{
            width: 800,
            height: 600,
            scaleX:1,
            scaleY:1
        },
        downloadStageConfig:{
            width : 100,
            height : 200,
            visible: true
        },
        mainImgConfig: {
            image: null,
        },
        iconGroupConfig: {},
        bannerRectConfig: {
            height : 100,
            width : 100,
            y : 100,
            fill : "white"
        },
        deviceInfoConfig: {
            x:100,
            y:0,
            text:"",
            fontSize:0,
            fontStyle:"bold",
            offsetY:0,
            fill:"black",
            draggable:true,
        },
        lensInfoConfig: {
            x:100,
            y:0,
            text:"",
            fontSize:0,
            offsetY:0,
            fontStyle:"normal",
            align:"center",
            fill:"gray",
            draggable:true,
        },
        iconInfoConfig: {
            image: null,
            x: 0,
            y:0,
            height:0,
            width:0,
        },
        verticalBarInfoConfig: {
            x: 0,
            y: 0,
            width:5,
            height:0,
            fill: "gray",
        },
        parameterInfoConfig: {
            x:100,
            y:0,
            text:"",
            fontSize:0,
            fontStyle:"bold",
            align:"center",
            offsetY:0,
            verticalAlign:"middle",
            fill:"black",
            draggable:true,
        },
        timeInfoConfig: {
            x:100,
            y:0,
            text:"",
            fontSize:0,
            fontStyle:"normal",
            align:"center",
            verticalAlign:"middle",
            offsetY:0,
            fill:"gray",
            draggable:true,
        },
    }
}

export {getInitData}