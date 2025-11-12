import HttpService from "./http.service";

class ApiKey {

  getAll = async (params) => {
    const apiKeyEndpoint = "/data/rh/mien-du-lieu/all";
    return await HttpService.get(apiKeyEndpoint, { params });
  };

  getListMienDuLieu = async (params) => {
    const apiKeyEndpoint = "/data/rh/mien-du-lieu";
    return await HttpService.get(apiKeyEndpoint, { params });
  };

  getListDoiTuongDuLieu = async (params) => {
    const apiKeyEndpoint = "/data/rh/doi-tuong-du-lieu";
    return await HttpService.get(apiKeyEndpoint, { params });
  };

  createToken = async (data) => {
    const createTokenEndPoint = "/data/module3/createToken";
    return await HttpService.post(createTokenEndPoint, data);
  };

  createApiKey = async (data) => {
    const createApiKeyEndPoint = "/data/rh/dbModule3/cltAPI";
    return await HttpService.post(createApiKeyEndPoint, data);
  };
}

export default new ApiKey();
