import request from "@/utils/request"
import { showToast } from 'vant'

export function getArchives(params) {
    return request.get("/archives", { params });
}

export function uploadArchive(data) {
    return request.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export function batchUploadArchives(data) {
    return request.post("/archives/batch_upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export function downloadArchive(params) {
    return request({
        url: '/archives/download',
        method: 'get',
        params,
        responseType: 'blob' // ✅ 关键
    })
}

export function batchUploadExcel(data) {
    return request({
        url: "/archives/batch_upload",
        method: "post",
        data,
        headers: { "Content-Type": "multipart/form-data" }
    });
}
