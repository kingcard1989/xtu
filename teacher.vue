<template>
  <div class="teacher-management">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>教师管理</span>
            <el-button type="primary" @click="showAddTeacherDialog" style="float: right;">新增教师</el-button>
          </div>
          <el-table :data="teachers" style="width: 100%">
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-avatar :size="50" v-if="getAvatarUrl(scope.row.id)" :src="getAvatarUrl(scope.row.id)"></el-avatar>
                <el-avatar v-else :size="50">{{ scope.row.name }}</el-avatar> <!-- 显示教师名字 -->
              </template>
            </el-table-column>
            <el-table-column prop="name" label="教师" />
            <el-table-column prop="subject" label="课程" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="showEditTeacherDialog(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="deleteTeacher(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增教师模态框 -->
    <el-dialog title="新增教师" :visible.sync="addTeacherDialogVisible">
      <el-form :model="newTeacher" :rules="formRules" ref="newTeacherForm">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="upload/avatar"
            show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="newTeacher.name"></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="newTeacher.subject"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newTeacher.email"></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="newTeacher.introduction"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTeacherDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTeacher">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑教师模态框 -->
    <el-dialog title="编辑教师" :visible.sync="editTeacherDialogVisible">
      <el-form :model="currentTeacher" :rules="formRules" ref="editTeacherForm">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="upload/avatar"
            show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="currentTeacher.name"></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="currentTeacher.subject"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentTeacher.email"></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="currentTeacher.introduction"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTeacherDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTeacher">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TeacherManagement',
  data() {
    return {
      teachers: [
        { id: 1, name: '张老师', subject: '数学', email: 'zhang@example.com' },
        { id: 2, name: '李老师', subject: '英语', email: 'li@example.com' },
        // 其他教师...
      ],
      avatars: [
        { id: 1, url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' },
        { id: 2, url: '' },
        // 其他头像...
      ],
      addTeacherDialogVisible: false,
      editTeacherDialogVisible: false,
      newTeacher: { name: '', subject: '', email: '', avatar: '', introduction: '' },
      currentTeacher: {},
      formRules: {
        name: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入教授科目', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        avatar: [{ required: false, message: '请上传头像', trigger: 'blur' }],
      },
    };
  },
  methods: {
    getAvatarUrl(teacherId) {
      const avatar = this.avatars.find(a => a.id === teacherId);
      return avatar ? avatar.url : ''; // 返回头像 URL 或空字符串
    },
    showAddTeacherDialog() {
      this.newTeacher = { name: '', subject: '', email: '', avatar: '', introduction: '' }; // 重置表单
      this.addTeacherDialogVisible = true;
    },
    addTeacher() {
      this.$refs.newTeacherForm.validate((valid) => {
        if (valid) {
          this.teachers.push({ ...this.newTeacher });
          this.addTeacherDialogVisible = false;
          this.$message.success('教师已添加');
        } else {
          this.$message.error('请填写完整信息');
        }
      });
    },
    showEditTeacherDialog(teacher) {
      this.currentTeacher = { ...teacher }; // 复制教师数据以进行编辑
      this.editTeacherDialogVisible = true;
    },
    updateTeacher() {
      this.$refs.editTeacherForm.validate((valid) => {
        if (valid) {
          const index = this.teachers.findIndex(t => t.email === this.currentTeacher.email);
          if (index !== -1) {
            this.teachers.splice(index, 1, this.currentTeacher);
            this.editTeacherDialogVisible = false;
            this.$message.success('教师信息已更新');
          }
        } else {
          this.$message.error('请填写完整信息');
        }
      });
    },
    deleteTeacher(teacher) {
      this.$confirm(`确定删除教师: ${teacher.name} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.teachers = this.teachers.filter(t => t !== teacher);
        this.$message.success('教师已删除');
      });
    },
    handleAvatarSuccess(response, file) {
      // 处理上传成功后的逻辑
      // 假设返回的 response 中包含头像的 URL
      if (this.addTeacherDialogVisible) {
        this.newTeacher.avatar = response.url; // 更新新增教师的头像
      } else {
        this.currentTeacher.avatar = response.url; // 更新编辑教师的头像
      }
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('上传头像只能是图片文件!');
      }
      return isImage;
    },
  },
};
</script>

<style>
.teacher-management {
  padding: 20px;
}
.dialog-footer {
  text-align: right;
}
.avatar-uploader {
  display: inline-block;
}
</style>