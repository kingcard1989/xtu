
import videoData from './video.json';
export default {
  getvideoInfo(id) {
    return new Promise((resolve) => {
      const video = videoData.find(video => video.id === parseInt(id));
      resolve({ code: 20000, data: { video } });
    });
  },
};