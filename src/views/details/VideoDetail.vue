<template>
  <div class="videodetail">
    <div class="center-content">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>视频详情</el-breadcrumb-item>
          <el-breadcrumb-item>{{ video.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </header>

      <div class="play-page clearfix" v-if="video">
        <div class="play-page-left">
          <div class="video-container">
            <div v-if="videoUrl" id="dplayer"></div>
            <el-button @click="toggleNotes" type="primary" class="notes-button">{{ showNotes ? '隐藏笔记' : '显示笔记' }}</el-button>
          </div>
          <div v-if="showNotes" class="message-editor-box" style="overflow-y: auto; max-height: calc(100vh - 150px);">
            <div v-for="(editor, index) in editors" :key="index" class="editor-instance">
              <v-md-editor v-model="editor.content" height="100%"></v-md-editor>
              <div class="editor-btn">
                <el-button @click="takeScreenshot" type="primary" class="screenshot-button">笔记保存</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import DPlayer from 'dplayer';
import html2canvas from 'html2canvas';
import videoapi from "@/api/fetchvideo.js"; 

export default {
  data() {
    return {
      video: null, // 视频信息
      videoUrl: '', // 视频链接
      showNotes: false, // 控制笔记显示
      editors: [{ content: '' }], // 笔记内容
      player: null, // DPlayer 实例
    };
  },
  created() {
    const videoId = this.$route.params.vid; // 获取查询参数中的 id
    if (videoId) {
      this.fetchVideoDetail(videoId); // 获取课程详情
    }
  },

  methods: {
    fetchVideoDetail(id) {
      videoapi.getvideoInfo(id).then((res) => {
        if (res.code === 20000) { // 使用严格比较
          this.video = res.data.video;
          this.videoUrl = res.data.video.url;
          this.$nextTick(() => {
            this.initPlayer(); // 确保 DOM 更新后再初始化播放器
          });
        } else {
          console.error(res.message); // 处理未找到视频的情况
          this.video = null; // 确保 video 为 null
        }
      }).catch((error) => {
        console.error("获取视频详情失败:", error); // 错误处理
        this.video = null; // 确保 video 为 null
      });
    },
    
    initPlayer() {
      const dplayerElement = document.getElementById('dplayer');
      if (dplayerElement) {
        this.player = new DPlayer({
          container: dplayerElement,
          autoplay: false,
          theme: '#FADFA3',
          loop: true,
          lang: 'zh-cn',
          screenshot: true,
          hotkey: true,
          preload: 'auto',
          volume: 0.7,
          mutex: true,
          video: {
            url: this.videoUrl,
            type: 'auto',
          },
          subtitle: {
            url: 'dplayer.vtt',
            type: 'webvtt',
            fontSize: '25px',
            bottom: '10%',
            color: '#b7daff',
          },
          danmaku: {
            id: this.$route.params.vid, // 弹幕 ID
            api: 'http://localhost:4330/danmaku', // 弹幕 API
            maximum: 1000, // 最大弹幕数量
            bottom: '15%', // 弹幕底部距离
            unlimited: true, // 是否无限弹幕
            speedRate: 0.5, // 弹幕速度
          },
          contextmenu: [
            {
              text: 'custom1',
              link: 'https://github.com/DIYgod/DPlayer',
            },
            {
              text: 'custom2',
              click: (player) => {
                console.log(player);
              },
            },
          ],
        });
      } else {
        console.error("未找到 DPlayer 容器元素");
      }
    },

    toggleNotes() {
      this.showNotes = !this.showNotes; // 切换笔记显示状态
      

          
    },
    
    takeScreenshot() {
      const element = document.querySelector('.github-markdown-body'); // 选择要截图的元素
      if (element) {
        html2canvas(element).then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png'); // 将画布转换为图片
          link.download = 'screenshot.png'; // 设置下载文件名
          link.click(); // 触发下载
        }).catch((error) => {
          console.error("截图失败:", error);
        });
      } else {
        console.error("未找到要截图的元素");
      }
    },
    next() {
      // 处理下一步逻辑
    },
  },
};
</script>

<style lang="scss" scoped>
.videodetail {
  .center-content {
    padding: 20px;
  }
  .play-page {
    display: flex;
    .play-page-left {
      flex: 1;
      .video-container {
        position: relative; // Set position relative for absolute positioning of button
        video {
          width: 100%;
          height: auto;
        }
        .notes-button {
          position: absolute; // Position the button absolutely
          top: 10px; // Distance from the bottom
          right: 10px; // Distance from the right
          z-index: 10; // Ensure the button is above the video
        }
      }
    }
    .play-page-info {
      flex: 1;
      padding: 20px;
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .videoContent {
        margin-top: 10px;
      }
    }
  }
}
</style>