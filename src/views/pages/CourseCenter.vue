
<template>
  <div class="course">
    <div class="center-content">
      <header>
        <!-- 搜索部分 -->
        <div class="header-search">
          <div class="search_left">
            <h2>全部课程</h2>
          </div>
          <div class="search_right">
            <div class="input_word_search">
              <el-input
                placeholder="输入你想学得课程"
                class="input-with-select"
                size="small"
                v-model="searchValue"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchClick()"
                ></el-button>
              </el-input>
            </div>
            <div class="hot_word_box">
              <span class="word_label">热门搜索：</span
              ><span
                class="word_item"
                v-for="(item, index) in hotList"
                :key="index"
                @click="hotClick(item)"
                >{{ item }}</span
              >
            </div>
          </div>
        </div>
        <div class="header-type">
          <div class="type-item clearfix">
            <span>全部资源：</span>
            <ul>
              <li
                :class="{ active: showclass==true }"
                @click="allClick"
              >
                全部
              </li>
              <li
                :class="{ active: showPdf==true }"
                @click="pdfClick"
              >
                学习资料
              </li>
              <li
                :class="{
                  active:
                    activeList[0] && activeList[0]['cateId'] == item.cateId,
                }"
                v-for="item in subjectList"
                :key="item.id"
                @click="subjectClick(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
          <div
            class="type-item clearfix"
            v-if="subjectchildList && subjectchildList.length"
          >
            <span>课程方向：</span>
            <ul>
              <li
                v-for="item in subjectchildList"
                :class="{
                  active:
                    activeList[1] && activeList[1]['cateId'] == item.cateId,
                }"
                :key="item.id"
                @click="activeClick(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </div>
        <div class="header-sort">
          <div class="type-item clearfix">
            <span>顺序：</span>
            <ul>
              <li
                v-for="item in orderList"
                :key="item.id"
                :class="searchCourse.order == item.id ? 'active' : ''"
                @click="orderClick(item)"
              >
                {{ item.txt }}
              </li>
            </ul>
          </div>
        </div>
        <div class="search-type clearfix">
          <span>当前搜索：</span>
          <ul>
            <li v-for="(item, index) in activeList" :key="index">
              {{ item.title }}
            </li>
          </ul>
        </div>
      </header>
      <!-- 列表 -->
      <div class="course-list clearfix">
        <div class="course-list-item" v-if="showclass" v-for="item in courseList" :key="item.id">
          <div class="item-img-box" @click="startStudyClick(item.courseId)">
            <img :src="item.cover" alt="" />
          </div>
          <div class="item-text-box">
            <p :title="item.title">
              {{ item.title }}
            </p>
            <div class="study clearfix">
              <div class="stuCount">
                <i class="el-icon el-icon-user-solid"></i
                ><span>{{ item.lessonNum }}课时</span>
              </div>
              <div class="startStudy" @click="startStudyClick(item.courseId)">
                开始学习
              </div>
            </div>
          </div>
        </div>
        <div class="course-list-item" v-if="showPdf" v-for="item in pdfList" :key="item.id">
        <div class="item-img-box" @click="handlePreview(item)">
          <img :src="item.cover" alt="PDF封面" />
          <div class="pdf-badge">PDF</div>
        </div>
        <div class="item-text-box">
          <p :title="item.title">{{ item.title }}</p>
          <div class="pdf-actions">
            <el-button 
              size="mini" 
              type="primary" 
              @click.stop="handleDownload(item)"
            >
              <i class="el-icon-download"></i> 下载
            </el-button>
            <el-button 
              size="mini" 
              @click.stop="handlePreview(item)"
            >
              <i class="el-icon-view"></i> 预览
            </el-button>
          </div>
        </div>
      </div>
      <el-dialog 
      title="PDF预览" 
      :visible.sync="previewVisible" 
      width="80%"
      top="5vh"
    >
      <iframe 
        :src="previewUrl" 
        style="width:100%; height:70vh; border:none;"
        v-if="previewVisible"
      ></iframe>
      <div slot="footer">
        <el-button @click="previewVisible = false">关闭</el-button>
      </div>
    </el-dialog>



      </div>

      <div style="text-align: center">
        <el-pagination
          :current-page.sync="current"
          :page-size="size"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="getCourseList"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import mockApi from "@/api/moc.js"; // 导入模拟 API
export default {
  data() {
    return {
      pdfList: [
        {
          id: 1,
          title: "Vue.js 开发指南",
          cover: require('@/assets/img/567.png'), 
          pdfUrl: "http://localhost:1238/pdfs/1122.pdf"
        },
        {
          id: 2,
          title: "JavaScript 高级编程",
          cover: require('@/assets/img/567.png'), 
          pdfUrl: "https://example.com/js-advanced.pdf"
        },
        {
          id: 3,
          title: "Web 安全最佳实践",
          cover: require('@/assets/img/567.png'), 
          pdfUrl: "https://example.com/web-security.pdf"
        }
      ],
      // PDF预览相关状态
      previewVisible: false,
      previewUrl: "",
      courseList: [],
      hotList: ["基础", "艺术", "设计"],
      orderList: [
        {
          id: 0,
          txt: "全部",
        },
        {
          id: 1,
          txt: "最新",
        },
        {
          id: 2,
          txt: "最热",
        },
      ],
      showclass: true,
      showPdf: false,
      current: 1,
      total: 0,
      size: 12,
      subjectList: [],
      subjectchildList: [],
      activeList: [],
      searchValue: "",
      searchCourse: {
        subjectId: "",
        title: "",
        order: 0,
      },
    };
  },
  watch: {
    searchCourse: {
      handler() {
        this.getCourseList();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getCourseCenterData(); // 获取课程中心数据
    this.getSubjectList(); // 获取课程分类
    this.getSujectList();
  },
  methods: {


    handleDownload(item) {
      const link = document.createElement('a')
      link.href = item.pdfUrl
      link.download = `${item.title.replace(/ /g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    // PDF预览方法
    handlePreview(item) {
      this.previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(item.pdfUrl)}&embedded=true`
      this.previewVisible = true
    },


    getCourseCenterData() {
      mockApi.getCourseCenterData().then((res) => {
        if (res.code === 20000) {
          
          this.courseList = res.data.courseList;
          this.hotList = res.data.hotList;
          this.subjectList = res.data.subjectList;
          this.orderList = res.data.orderList;
          this.total = this.courseList.length; // 更新总课程数
        }

      });
    },
    getCourseList() {
      
    },
    getSujectList() {
      
    },
    orderClick(item) {
      this.searchCourse.order = item.id;
      this.current = 1;
    },

    init() {
      this.current = 1;
      this.searchCourse = {
        subjectId: "",
        title: "",
        order: 0,
      };
      this.searchCourse.order = 0;
      this.activeList = [];
      this.subjectchildList = [];
    },
    allClick() {
      this.showPdf = false; // 显示 PDF 预览
      this.showclass = true;
      this.init();
    },
    pdfClick(){
      this.showPdf = true; // 显示 PDF 预览
      this.showclass = false;
    },
    subjectClick(item) {
      this.searchCourse.order = 0;
      this.activeList = [item, {}];
      this.subjectchildList = item.children;
      this.activeList.splice(1, 1, item.children[0]);
      this.searchCourse.subjectId = item.children[0].cateId;
    },
    activeClick(item) {
      this.searchCourse.order = 0;
      this.activeList.splice(1, 1, item);
      this.searchCourse.subjectId = item.cateId;
    },

    startStudyClick(id) {
      this.$router.push(`/courseDetail?id=${id}`);
    },
    searchClick() {
      this.init();
      this.searchCourse.title = this.searchValue;
    },
    hotClick(item) {
      this.searchValue = item;
      this.searchClick();
    },
  },
};
</script>


<style lang="scss" >
.course .el-dialog,
.course .el-pager li {
  background: transparent !important;
  -webkit-box-sizing: border-box;
}
.course .el-pagination .btn-next,
.course .el-pagination .btn-prev {
  background: transparent !important;
}

.course {
  width: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  padding-bottom: 80px;
}
header {
  margin-top: 20px;
  .header-search {
    display: flex;
    justify-content: space-between;
    -webkit-box-align: center;
    margin-bottom: 20px;
    -webkit-box-pack: justify;
    align-items: center;
    .search_left {
      flex: 1;
      height: 44px;
      line-height: 44px;
      overflow: hidden;
    }
    .search_right {
      .input_word_search {
      }
      .hot_word_box {
        margin-top: 8px;
        .word_label {
          color: #909399;
        }
        .word_item {
          color: #303133;
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .header-type,
  .header-sort {
    width: 100%;
    line-height: 26px;
    background-color: #fff;
    font-size: 18px;
    padding: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 6px;
    margin-bottom: 10px;
    .type-item {
      &:not(:first-child) {
        margin-top: 15px;
      }
      span {
        font-weight: 600;
        color: #303133;
        float: left;
        margin-right: 20px;
      }
      ul {
        float: left;
        width: 1030px;
        li {
          float: left;
          font-size: 14px;
          color: #909399;
          line-height: 26px;
          margin-right: 30px;
          cursor: pointer;
          &.active {
            color: $theme-color-font;
            font-weight: 550;
          }
        }
      }
    }
  }
  .search-type {
    line-height: 30px;
    padding-left: 10px;
    margin-bottom: 10px;
    span {
      color: #999;
      float: left;
      margin-right: 20px;
    }
    ul {
      float: left;
      width: 1060px;
      li {
        float: left;
        line-height: 30px;
        padding-right: 10px;
        margin-right: 15px;
        position: relative;
      }
    }
  }
}
.course-list {
  margin-top: 20px;
  width: 1200px;
  .course-list-item {
    border-style: none;
    font-size: inherit;
    list-style-type: none;
    text-decoration: none;
    float: left;
    margin-bottom: 30px;
    width: 277px;
    min-height: 276px;
    -webkit-transition: 0.2s;
    transition: 0.2s;
    &:not(:nth-child(4n)) {
      margin-right: 30px;
    }
    .item-img-box {
      cursor: pointer;
      position: relative;
      background-color: #eff0f2;
      width: 277px;
      height: 179px;
      overflow: hidden;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      &:hover {
        img {
          transform: scale(1.3);
        }
      }
      img {
        width: 100%;
        height: 100%;
        -webkit-transition: 0.2s;
        transition: 0.2s;
      }
    }
    .item-text-box {
      padding: 20px 10px;
      background-color: #fff;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      p {
        width: 257px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
      }
      .study {
        margin-top: 20px;
        .stuCount {
          float: left;
          font-size: 14px;
          color: #999;
        }
        .startStudy {
          float: right;
          width: 78px;
          height: 24px;
          border: 1px solid $theme-color-font;
          color: $theme-color-font;
          text-align: center;
          line-height: 24px;
          cursor: pointer;
          &:hover {
            color: #fff;
            background: linear-gradient(
              to right,
              rgb(251, 146, 60),
              rgb(251, 113, 133)
            );
          }
        }
      }
    }
  }
}
</style>
