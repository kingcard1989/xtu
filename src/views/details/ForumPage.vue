<template>
  <div>
    <div class="forum-box">
      <div class="forum-box-ul">
        <el-tabs v-model="forumActive" @tab-click="handleClick">
          <el-tab-pane
            :label="item.name"
            :name="item.id + ''"
            v-for="item in forumTablist"
            :key="item.id"
          >
            <div class="forum-tab-content">
              <div
                class="forum-content-item"
                v-for="item in filteredAclList"
                :key="item.id"
              >
                <div class="forum-item-title">
                  <div class="community-sign" v-if="item.isTop">置顶</div>
                  <div class="community-sign-essence" v-if="item.isEss">
                    精华
                  </div>
                  <a
                    @click="$router.push(`/forumCenter/detail/${item.id}`)"
                    class="title-text ellipsis"
                    target="_blank"
                    >{{ item.title }}</a
                  >
                  <a
                    v-if="item.tagList"
                    v-for="tag in item.tagList"
                    class="topic-t"
                  >
                    <span>#{{ tag.name }}#</span>
                  </a>
                </div>
                <div class="forum-item-text">
                  <div v-html="item.content">{{ item.content }}</div>
                </div>
                <div class="forum-item-info clearfix">
                  <div class="forum-item-tag fl">
                    <span class="icon-box">
                      <i class="el-icon el-icon-s-comment"></i
                      >{{ item.viewCount }}</span
                    ><span class="icon-box"
                      ><i class="el-icon el-icon-s-comment"></i>
                      1
                      <!-- {{ item.count2 }} --> </span
                    ><span class="icon-box"
                      ><i class="el-icon el-icon-view"></i>
                      2
                      <!-- {{ item.count3 }} -->
                    </span>
                  </div>
                  <div class="forum-text-date fr">
                    <span class="info-item"
                      >{{ item.stuName }}
                      <span>发布于{{ item.updateTime }}</span></span
                    >
                  </div>
                </div>
              </div>
            </div></el-tab-pane
          >
        </el-tabs>
        <div style="text-align: center; padding: 10px 0">
          <el-pagination
            :current-page.sync="current"
            background
            layout="total,prev, pager, next"
            :total="total"
            @current-change="getAclList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      forumActive: "0",
      forumTablist: [
        { name: "全部", id: 0 },
        { name: "讨论", id: 1 },
        { name: "问答", id: 2 }
      ],
      AclList: [
        {
          id: 1,
          title: "示例标题1",
          isTop: false,
          isEss: true,
          content: "这是一个示例内容1。",
          viewCount: 100,
          stuName: "用户1",
          updateTime: "2023-10-27",
          tagList: [{ name: "讨论" }]
        },
        {
          id: 2,
          title: "示例标题2",
          isTop: true,
          isEss: false,
          content: "这是一个示例内容2。",
          viewCount: 150,
          stuName: "用户2",
          updateTime: "2023-10-28",
          tagList: [{ name: "问答" }]
        }
      ],
      total: 2,
      current: 1,
      params: {},
    };
  },
  computed: {
    filteredAclList() {
      if (this.forumActive === "0") {
        return this.AclList;
      }
      const activeTab = this.forumTablist.find(tab => tab.id === parseInt(this.forumActive));
      return this.AclList.filter(item =>
        item.tagList.some(tag => tag.name === activeTab.name)
      );
    }
  },
  created() {
    this.getAclList();
    this.getAclCateList();
  },
  methods: {
    handleClick() {
      this.current = 1;
      this.getAclList();
    },
    getAclList() {
      // 排序：将 isTop 为 true 的项目放在上层
      this.AclList.sort((a, b) => {
        return b.isTop - a.isTop;
      });
    },
    getAclCateList() {
      // 模拟获取分类数据
      this.forumTablist = [
        { name: "全部", id: 0 },
        { name: "讨论", id: 1 },
        { name: "问答", id: 2 }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.forum-box {
  padding: 20px 30px;
  background: #fff;
  border-radius: 10px;
  position: relative;
  .forum-box-ul {
    .forum-tab-content {
      .forum-content-item {
        width: 100%;
        border-bottom: 1px solid #ededed;
        padding: 22px 0;
        letter-spacing: normal;
        .forum-item-title {
          .community-sign {
            display: inline-block;
            width: 42px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            font-weight: 400;
            color: #fff;
            border-radius: 10px;
            text-align: center;
            background: $theme-color-icon2;
            margin-right: 10px;
          }
          .community-sign-essence {
            display: inline-block;
            width: 42px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            font-weight: 400;
            color: #fff;
            border-radius: 10px;
            text-align: center;
            background: $theme-color-icon;
            margin-right: 10px;
          }
          .title-text {
            font-size: 16px;
            color: #333;
            line-height: 21px;
            max-width: 450px;
            margin-right: 20px px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-weight: 700;
          }
          .topic-t {
            margin-left: 12px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #ff9e3f;
            cursor: pointer;
          }
        }
        .forum-item-text {
          font-weight: 400;
          margin: 16px 0 26px;
          color: #888;
          line-height: 22px;
          font-size: 14px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .forum-item-info {
          .forum-item-tag {
            .icon-box {
              margin-right: 20px;
              color: #e2e2e2;
            }
          }
          .forum-text-date {
            line-height: 26px;
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
