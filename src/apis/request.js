import { service } from "@/apis/config";

function request(options) {
  options.method = options.method || "get";

  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }

  return service(options);
}

["get", "post", "put", "delete"].forEach((item) => {
  request[item] = (url, data) => {
    return request({
      url,
      data,
      method: item,
    });
  };
});

export { request };
