<template>
    <div>
        <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>学生管理</span>
            <el-button type="primary" @click="showAddTeacherDialog" style="float: right;">新增学生</el-button>
          </div>
          <el-table :data="teachers" style="width: 100%">
            <el-table-column prop="name" label="学生" />
            <el-table-column prop="subject" label="所选课程" />
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
  
      <!-- 新增学生模态框 -->
      <el-dialog title="新增学生" :visible.sync="addTeacherDialogVisible">
        <el-form :model="newTeacher">
          <el-form-item label="姓名" :rules="[{ required: true, message: '请输入学生姓名', trigger: 'blur' }]">
            <el-input v-model="newTeacher.name"></el-input>
          </el-form-item>
          <el-form-item label="所选课程" :rules="[{ required: true, message: '请输入所选课程', trigger: 'blur' }]">
            <el-input v-model="newTeacher.subject"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
            <el-input v-model="newTeacher.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTeacherDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTeacher">确 定</el-button>
        </span>
      </el-dialog>
  
      <!-- 编辑学生模态框 -->
      <el-dialog title="编辑学生" :visible.sync="editTeacherDialogVisible">
        <el-form :model="currentTeacher">
          <el-form-item label="姓名" :rules="[{ required: true, message: '请输入学生姓名', trigger: 'blur' }]">
            <el-input v-model="currentTeacher.name"></el-input>
          </el-form-item>
          <el-form-item label="所选课程" :rules="[{ required: true, message: '请输入所选课程', trigger: 'blur' }]">
            <el-input v-model="currentTeacher.subject"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
            <el-input v-model="currentTeacher.email"></el-input>
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
    name: 'StudentManagement',  // Changed from TeacherManagement
    data() {
      return {
        teachers: [
          { name: '小李', subject: '数学', email: 'xiaoli@example.com' },
          { name: '小明', subject: '英语', email: 'xiaoming@example.com' },
          // 其他学生信息...
        ],
        addTeacherDialogVisible: false,
        editTeacherDialogVisible: false,
        newTeacher: { name: '', subject: '', email: '' },
        currentTeacher: {},
      };
    },
    methods: {
      showAddTeacherDialog() {
        this.newTeacher = { name: '', subject: '', email: '' }; // 重置表单
        this.addTeacherDialogVisible = true;
      },
      addTeacher() {
        this.teachers.push({ ...this.newTeacher });
        this.addTeacherDialogVisible = false;
        this.$message.success('学生已添加');
      },
      showEditTeacherDialog(teacher) {
        this.currentTeacher = { ...teacher }; // 复制学生数据以进行编辑
        this.editTeacherDialogVisible = true;
      },
      updateTeacher() {
        const index = this.teachers.findIndex(t => t.email === this.currentTeacher.email);
        if (index !== -1) {
          this.teachers.splice(index, 1, this.currentTeacher);
          this.editTeacherDialogVisible = false;
          this.$message.success('学生信息已更新');
        }
      },
      deleteTeacher(teacher) {
        this.$confirm(`确定删除学生: ${teacher.name} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.teachers = this.teachers.filter(t => t !== teacher);
          this.$message.success('学生已删除');
        });
      },
    },
  };
  </script>
