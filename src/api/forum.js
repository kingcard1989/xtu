import forumData from '@/api/forum.json';

export default {
  getForumInfo(id) {
    return new Promise((resolve, reject) => {
      // 假设 forumData 是一个对象，包含 aclInfo 和 comments
      if (forumData.aclInfo.id === parseInt(id)) {
        resolve({
          code: 20000,
          data: {
            aclInfo: forumData.aclInfo,
            comments: forumData.comments
          }
        });
      } else {
        reject({
          code: 404,
          message: 'Forum not found'
        });
      }
    });
  }
};