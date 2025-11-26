import request from "@/utils/request"

export function sendRating(data) {
    return request({
        url: "/rating",
        method: "post",
        data
    });
}