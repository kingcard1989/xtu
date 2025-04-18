<template>
  <div>
    <div class="banner">
      <el-carousel height="500px">
        <el-carousel-item v-for="item in banner" :key="item.id">
          <img :src="item.imageUrl" :alt="item.title" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="friendlinks homemok">
      <div class="flink-content center-content">
        <div
          class="flink-item fadeInUp"
          v-for="(item, key) in blogroll"
          :key="item.id"
          :style="{ animationDelay: key * 0.1 + 's' }"
          @click="goLinkClick(item.link)"
        >
          <div class="flink-item-img">
            <img :src="item.cover" alt="" />
          </div>
          <div class="flink-item-text">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="recommend homemok">
      <div class="recommend-content center-content">
        <div class="left-notice recommend-item">
          <div class="notice-title">
            <span class="title-text">
              <svg class="icon-font">
                <use xlink:href="#icon-gonggao"></use>
              </svg>
              最新公告
            </span>
            <a
              class="title-right"
              target="_blank"
              @click="$router.push(`/news/list`)"
            >
              查看更多
              <i class="el-icon-d-arrow-right"></i
            ></a>
          </div>
          <div class="notice-list">
            <div
              class="notice-list-item"
              v-for="item in affiche"
              :key="item.id"
              @click="$router.push(`/news/detail/${item.id}`)"
            >
              <a class="noticeitem-text ellipsis" :title="item.title"
                ><i class="iconfont icon-yuandian"></i>
                {{ item.title }}
              </a>
              <div class="noticeitem-time">
                {{ new Date(item.updateTime).format() }}
              </div>
            </div>
          </div>
        </div>
        <div class="right-forum recommend-item">
          <div class="notice-title">
            <span class="title-text">
              <svg class="icon-font">
                <use xlink:href="#icon-wendang1"></use>
              </svg>
              热门问答
            </span>
            <a
              class="title-right"
              @click="$router.push('/forumCenter')"
              target="_blank"
            >
              查看更多
              <i class="el-icon-d-arrow-right"></i
            ></a>
          </div>
          <div class="notice-list">
            <div
              class="notice-list-item"
              v-for="item in aclhot"
              :key="item.artId"
            >
              <a
                class="noticeitem-text"
                @click="$router.push(`/forumCenter/detail/${item.artId}`)"
                :title="item.title"
                ><i class="iconfont icon-yuandian"></i>
                {{ item.title }}
              </a>
              <div class="noticeitem-time">
                {{ new Date(item.createTime).format() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

 
    <div class="hotCourse homemok">
      <div class="hotCourse-content center-content">
        <h3 class="mok-title">热门学习资源</h3>
        <div class="hotCourse-list clearfix">
          <div
            class="hotCourse-list-item fadeInUp"
            v-for="(item, key) in course"
            :key="item.id"
            :style="{ animationDelay: key * 0.1 + 's' }"
            @click="$router.push(`/courseDetail?id=${item.courseId}`)"
          >
            <div class="item-img">
              <img :src="item.cover" :alt="item.title" />
            </div>
            <h2 class="item-text ellipsis">
              {{ item.title }}
            </h2>
          </div>
        </div>
        <div class="mok-more">
          <a @click="showModal = true">更多
            <i class="el-icon el-icon-d-arrow-right"></i>
          </a>
        </div>
        <div v-if="showModal" class="modal">

<div class="modal-content">

  <span class="close" @click="showModal = false">&times;</span>

  <know />

</div>
  </div>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Know from './know.vue'; 
export default {
  components: {

Know 
},
  data() {
    return {
      showModal: false,
      affiche: [
      { id: 1,  title: '这是第一条的公告' ,updateTime:'2024-10-16'},
      { id: 2,  title: '这是第二条的公告' ,updateTime:'2024-10-15'},
      { id: 3,  title: '这是第三条的公告' ,updateTime:'2024-10-17'},
      { id: 4,  title: '这是第四条的公告' ,updateTime:'2024-10-19'},
      { id: 5,  title: '这是第五条的公告' ,updateTime:'2024-10-13'},
      { id: 6,  title: '这是第六条的公告' ,updateTime:'2024-10-11'},

      ],
      banner: [
      { id: 1, imageUrl: 'https://jwxy.xtu.edu.cn/images/weixintupian_20231219193140.jpg', title: 'Image 1' },
      { id: 2, imageUrl: 'https://jwxy.xtu.edu.cn/images/banner4.jpg', title: 'Image 2' },
      { id: 3, imageUrl: 'https://jwxy.xtu.edu.cn/images/banner3.jpg', title: 'Image 3' },
      { id: 4, imageUrl: 'https://jwxy.xtu.edu.cn/images/banner2.jpg', title: 'Image 4' },
      { id: 5, imageUrl: 'https://jwxy.xtu.edu.cn/images/banner1.jpg', title: 'Image 5' },
      ],
      blogroll: [
      {
          id: 1,
          cover: 'https://jwxy.xtu.edu.cn/images/logo1.png', 
          title: '湘潭大学计网院',
          link: 'https://jwxy.xtu.edu.cn/index.htm'
        },
        {
          id: 2,
          cover: 'http://www.cybersecbase.com/Upload/1602730889.jpg',
          title: '湖南省网安基地',
          link: 'http://www.cybersecbase.com/' 
        },
        {
          id: 3,
          cover: 'https://static.nowcoder.com/fe/file/logo/1.png', 
          title: '牛客',
          link: 'https://www.nowcoder.com/'
        },
        {
          id: 4,
          cover: 'https://www.itheima.com/images/logo.png', 
          title: '黑马程序员',
          link: 'https://www.itheima.com/' 
        },
      ],
      course: [
      {
          id: 1,
          courseId: 1, 
          title: '网络安全知识基础',
          cover: require('@/assets/img/presentation.png'), 
        },
        {
          id: 2,
          courseId: 2, 
          title: '网络安全与法律',
          cover: require('@/assets/img/loyal.png'), 
        },

        {
          id: 3,
          courseId: 3, 
          title: '网络诈骗处理方法',
          cover: require('@/assets/img/123.png'), 
        },

        {
          id: 4,
          courseId: 4, 
          title: '网络安全入校园',
          cover: require('@/assets/img/567.png'), 
        },
        {
          id: 5,
          courseId: 5, 
          title: '网络安全入校园',
          cover: require('@/assets/img/567.png'), 
        },




      ],
      aclhot: [
      { artId: 1,  title: '这是一个热点' ,createTime:'2024-10-16'},


      ],
    };
  },
  methods: {
    goLinkClick(link) {
      window.open(link, '_blank'); 
    },
  },
};
</script>

<style lang="scss" scoped>
.homemok {
  padding: 78px 0;
}
.mok-more {
  text-align: center;
  a {
    font-size: 22px;
    letter-spacing: 2px;
    font-weight: 600;
    .el-icon {
      display: inline-block;
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
      font-weight: 400;
    }
  }
}
.mok-title {
  text-align: center;
  line-height: 37px;
  letter-spacing: 3px;
  font-weight: 600;
  font-size: 26px;
  padding-bottom: 52px;
}
.center-content {
  width: 1200px;
  margin: auto;
}
.banner {
  padding-top: 5px;
  img {
    width: 100%;
    height: 100%;
  }
}
.fadeInUp {
  animation-name: fadeInUp;
  animation-duration: 0.5s;
  animation-delay: 0.3s;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
.friendlinks {
  .flink-content {
    width: 1230px;
    display: flex;
    .flink-item {
      cursor: pointer;
      width: 254px;
      height: 310px;
      border: 1px solid #eef3f7;
      background: #f5f7fa;
      -webkit-box-shadow: 4px 4px 33px 0 #dae8f0;
      box-shadow: 4px 4px 33px 0 #dae8f0;
      -webkit-transition: all 0.2s;
      transition: all 0.2s;
      padding-top: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      // animation-delay: 0.3s;
      // animation-duration: 1s;
      .flink-item-img {
        text-align: center;
        img {
          width: 60%;
        }
      }
      .flink-item-text {
        width: 163px;
        padding-top: 27px;
        margin: auto;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 2px;
      }
      &:hover {
        background: #fff;
      }

      &:not(:first-child) {
        margin-left: 68px;
      }
    }
  }
}
.recommend {
  background: #f5f7fa;
  .recommend-content {
    margin: auto;
    display: flex;
    justify-content: space-around;
    .recommend-item {
      overflow: hidden;
      width: 567px;
      height: 360px;
      border-radius: 6px;
      background-color: #fff;
      padding: 24px 30px 30px 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-transition: all 0.2s;
      transition: all 0.2s;
      &:hover {
        box-shadow: 4px 4px 5px 4px #e4e8eb;
      }
    }
    .left-notice,
    .right-forum {
      .notice-title {
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 26px;
        .title-text {
          color: #303133;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: 2px;
          font-size: 16px;
        }
        .title-right {
          color: #606266;
          font-size: 14px;
          letter-spacing: 1px;
          float: right;
        }
      }
      .notice-list {
        padding-top: 27px;
        .notice-list-item {
          display: flex;
          font-size: 14px;
          color: #606266;
          .noticeitem-text {
            text-align: left;
            line-height: 20px;
            letter-spacing: 1px;
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            -webkit-transition: all 0.2s;
            transition: all 0.2s;
            color: inherit;
            &:hover {
              color: $theme-color-font;
            }
          }
          .noticeitem-time {
            width: 110px;
            text-align: right;
          }
          &:not(:first-child) {
            margin-top: 14px;
          }
        }
      }
    }
  }
}
.hotCourse {
  .hotCourse-content {
    .hotCourse-list {
      .hotCourse-list-item {
        float: left;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: rgba(215, 219, 221, 0.5) 8px 8px 18px 0;
        width: 226px;
        height: 224px;
        margin-bottom: 36px;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
        cursor: pointer;
        .item-img {
          width: 100%;
          height: 166px;
          border-radius: 0 0 6px 6px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .item-text {
          line-height: 58px;
          text-align: center;
          color: #303133;
          font-size: 14px;
          padding: 0 10px;
        }
        &:hover {
          transform: translateY(-5px);
          box-shadow: 10px 10px 16px 0 #b6cdd8;
        }
        &:not(:nth-child(5n)) {
          margin-right: 17px;
        }
      }
    }
  }
}
.modal {

display: flex;

position: fixed;

z-index: 1000;

left: 0;

top: 0;

width: 100%;

height: 100%;

overflow: auto;

background-color: rgba(0, 0, 0, 0.5); /* 背景半透明 */

}



.modal-content {
  position: relative; 
  margin: auto; 
  width: 100%; 
  max-width: 1200px; 
  height: 100%; 
  max-height: 600px; 
  background-color: #fefefe; 
  border: 1px solid #888; 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
  transform: translateY(-50%); 
  top:40%;
  left: 40%;
  transform: translate(-50%, -50%); 
}.close {

color: #aaa;

float: right;

font-size: 28px;

font-weight: bold;

}



.close:hover,

.close:focus {

color: black;

text-decoration: none;

cursor: pointer;

}

</style>
