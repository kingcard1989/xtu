<template>
  <div class="coursedetail">
    <div class="center-content">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">选修课</el-breadcrumb-item>
          <el-breadcrumb-item>课程详情</el-breadcrumb-item>
          <el-breadcrumb-item>{{ course && course.titles }}</el-breadcrumb-item>
        </el-breadcrumb>
      </header>

      <div class="play-page clearfix" v-if="course">
        <div class="play-page-left">
          <img :src="course.cover" :alt="course.titles" />
        </div>
        <div class="play-page-info">
          <p title="Spring&nbsp;Boot实战入门—黑马分布式网盘系统开发" class="title ellipsis">
            {{ course.titles }}
          </p>
          <div class="author">讲师：{{ course.teacher.teacherName }}</div>
          <div class="courseContent">
            <p>课程描述：</p>
            <div v-html="course.description"></div>
          </div>
          <ul class="courseinfo clearfix">
            <li>
              课时数
              <p>{{ course.lessonNum }}节</p>
            </li>
            <li>
              学分
              <p>{{ course.credit }}分</p>
            </li>
            <li>
              限制人数
              <p>{{ course.limitCount }}人</p>
            </li>
          </ul>
          <div style="text-align: center; margin-top: 50px">
            <el-button v-if="!isJoin" @click="joinClick()" plain>加入选修课程</el-button>
          </div>
        </div>
      </div>

      <div class="play-detail clearfix" v-if="course">
        <div class="play-detail-left">
          <el-tabs v-model="tabActive">
            <el-tab-pane label="课程介绍" name="课程介绍">
              <div class="playdetail-ctx">
                <div v-html="course.description"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="课件下载" name="课件下载" >
              <p>扫描网盘获取学习资料</p>
              <img :src="course.courseware" alt="" />
            </el-tab-pane>
            <el-tab-pane label="课程大纲" name="课程大纲" >
              <div class="catalog-ctx">
                <el-collapse :model="chapterActive" accordion>
                  <el-collapse-item
                    v-for="item in course.chapter"
                    :key="item.id"
                    :title="item.title"
                    :name="item.id + ''"
                  >
                    <div
                      class="catalog-item"
                      :class="item.state == 1 ? 'finish' : 'active'"
                      v-for="item2 in item.children"
                      :key="item2.id"
                    >
                    <router-link :to="'/player/' + item2.id" >
                        {{ item2.title }}

                      </router-link>
                      <!-- @click="$router.push('/player/' + item2.videoSourceId)" -->

                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
            <!-- 删除课程大纲相关的 tab-pane -->
          </el-tabs>
          
        </div>
        <div class="play-detail-right">
          <div class="right-mok">
            <p class="title">讲师介绍</p>
            <div class="info-box" @click="$router.push(`/teacherDetail?id=${course.teacher.teacherId}`)">
              
              <div class="info-author">
                <span>{{ course.teacher.teacherName }}</span>
                <p>{{ course.teacher.career }}</p>
              </div>
              <div class="text">{{ course.teacher.intro}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mockApi from "@/api/moc.js"; // 模拟使用的 加入数据库以后解除
import { mapState } from "vuex";
import None from "@/components/common/no-databox.vue";

export default {
  data() {
    return {
      tabActive: "课程介绍",
      course: null,
      teacher: null,
      videoListProgress: [],
      search: {
        courseId: "",
        paperType: 1,
      },
      current: 1,
      chapter: [],
    };
  },
  components: {
    None,
  },
  computed: {
    ...mapState({ userInfo: (state) => state.user }),
    isJoin() {
      return this.userInfo.token && this.course; // 修改为检查 course 是否存在
    },
  },
  methods: {
    joinClick() {
      if (this.$route.query && this.$route.query.id) {
        mockApi.joinElective(this.$route.query.id).then((res) => {
          if (res.code === 20000) {
            this.$message.success(res.message);
            location.reload();
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.$message.error("请先选择课程");
      }
    },
    getCourseDetail(id) {
      mockApi.getCourseInfo(id).then((res) => {
        if (res.code == 20000) {
          this.course = res.data.course;
          this.chapter = res.data.course.chapter;
        }
      });
    },
    getProgress() {
      mockApi.learnprogress().then((res) => {
        this.videoListProgress = res.data.items;
      });
    },
  },
  created() {
    const courseId = this.$route.query.id; // 获取查询参数中的 id
    if (courseId) {
      this.getCourseDetail(courseId); // 获取课程详情
      this.getProgress(); // 获取学习进度
    }
  },
};
</script>



<style lang="scss">
.coursedetail .el-collapse-item__content {
  padding-bottom: 0px;
  padding-left: 15px;
}
.coursedetail .el-collapse-item__header {
  background-color: #fcfcfc;
  padding: 0px 10px;
}
.coursedetail {
  width: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  padding-bottom: 80px;
  .center-content {
    height: 100%;
    min-height: 800px;
    padding-top: 20px;
  }
  .card-exam-box {
    text-align: left;
    font-size: 14px;
    line-height: 30px;
    border-bottom: 1px solid #f7f7f7;
    padding: 10px;
  }
  .answer-body {
    padding: 5px;
    display: flex;
    flex-direction: row;
    .answer-item {
      text-align: left;
      flex: 1;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      padding: 10px 20px 10px 20px;
      line-height: 40px;
    }
  }
}
header {
  margin-bottom: 20px;
}
.play-page {
  .play-page-left {
    position: relative;
    float: left;
    width: 910px;
    height: 570px;
    background-color: #000;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    & > img {
      width: 100%;
      height: 100%;
    }
    & > video {
      width: 100%;
      height: 100%;
    }
  }
  .play-page-info {
    float: right;
    width: 290px;
    height: 570px;
    background-color: #1b1d25;
    color: #fff;
    padding: 18px 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .title {
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .courseContent {
      padding: 18px 0;
      font-size: 12px;
      border-bottom: 1px solid #333;
      word-break: break-all;
      word-wrap: break-word;
      p {
        color: #ccc;
      }
      .courseContent-txt {
        font-size: 12px;
        color: #999;
        line-height: 22px;
        display: inline-block;
        margin-top: 3px;
        text-indent: 2px;
        word-break: break-all;
        word-wrap: break-word;
      }
    }
    .courseinfo {
      border-bottom: 1px solid #333;
      padding: 16px 0;

      li {
        float: left;
        width: 70px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        &:nth-child(2) {
          text-align: center;
          width: 100px;
          margin: 0 10px;
        }
        p {
          font-size: 14px;
          color: #999;
          margin-top: 12px;
          text-align: center;
        }
      }
    }
    .author {
      margin-top: 20px;
      border-bottom: 1px solid #333;
      padding-bottom: 18px;
    }
  }
}

.play-detail {
  margin-top: 20px;
  box-sizing: content-box;
  .play-detail-left {
    float: left;
    padding: 13px;
    box-sizing: border-box;
    width: 890px;
    background-color: #fff;
    .playdetail-ctx {
      padding: 20px 30px;
      min-height: 686px;
      line-height: 22px;
      word-break: break-all;
      word-wrap: break-word;
      img {
        width: 100%;
      }
    }
    .catalog-ctx {
      padding: 20px;
      .catalog-item {
        cursor: pointer;
        padding: 10px;
        border-bottom: 1px solid #f8f8f8;
        i {
          margin-left: 15px;
          font-size: 12px;
          vertical-align: middle;
          margin-bottom: 2px;
        }
        &:hover {
          background: #f0f6ff;
        }
        &.finish {
          i {
            color: #52cc5c;
          }
        }
        &.active {
          i {
            color: $theme-color-font;
          }
        }
      }
    }
  }
  .play-detail-right {
    float: right;
    width: 290px;
    .right-mok {
      background-color: #fff;
      .title {
        padding: 17px 20px;
        font-size: 16px;
        border-bottom: 1px solid #e5e5e5;
      }
      .info-box {
        cursor: pointer;
        padding: 15px 20px;
        font-size: 14px;
        color: #333;
        .text {
          text-indent: 28px;
          line-height: 24px;
          margin: 15px 0px;
        }
        .info {
          display: flex;
          align-items: center;
          .info-author {
            margin-left: 10px;
            line-height: 25px;
            span {
              font-weight: bold;
            }
            p {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>