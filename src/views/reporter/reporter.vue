<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
           <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('reporter:add')">Create</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list"
      v-loading.body="listLoading"
      element-loading-text="loading"
      border fit
              highlight-current-row>
      <el-table-column align="center" label="No" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name Reporter" prop="name" style="width: 60px;"  ></el-table-column>
      <el-table-column align="center" label="Date Reporter" prop="date" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="Name Tools" prop="host_name" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="Problems" prop="description" style="width: 60px;"></el-table-column>
       <el-table-column align="center" label="Confirm" style="width: 60px;">
           <template slot-scope="scope">
             <el-tag type="success" v-if="scope.row.confirm===1">Confirm</el-tag>
             <el-tag type="danger"  v-else>has not been confirmed</el-tag>
           </template>
       </el-table-column>
      <el-table-column align="center" label="Action" width="220" v-if="hasPerm('reporter:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">Edit</el-button>
          <router-link to="/master/tools" tag="button" type="primary" icon="edit">foo</router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempReporter" label-position="left" label-width="120px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="Name Reporter" required>
          <el-input type="text" v-model="tempReporter.name">
          </el-input>
        </el-form-item>
        <el-form-item label="Date Report" style="width: 400px;"  required>
          <el-date-picker type="datetime"  format="yyyy/MM/dd, HH:mm:ss"
           value-format="yyyy-MM-dd, HH:mm:ss" v-model="tempReporter.date"></el-date-picker>
          </el-input>
        </el-form-item>
        <el-form-item label="Tools Name" style="width: 400px;" required>
          <el-select v-model="tempReporter.toolsId" placeholder="please choose">
            <el-option
              v-for="item in tools"
              :key="item.tools_id"
              :label="item.host_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Problems " style="width: 400px;" required>
          <el-select v-model="tempReporter.problemsId" placeholder="please choose">
            <el-option
              v-for="item in problems"
              :key="item.problems_id"
              :label="item.description"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/uploadImage/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="tempReporter.avatar" :src="global_.OSS+tempReporter.avatar" class ="avatar">
          <i v-else  class= "el-icon-plus avatar-uploader-icon"avatar-uploader-icon</i>
          <el-button size="small" type="primary">Click to upload</el-button>
          <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </el-upload>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createReporter">Create</el-button>
        <el-button type="primary" v-else @click="updateReporter">Modify</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileList2:[{name: 'food.jpeg',
         url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        totalCount: 0,
        list: [],
        listLoading: false,
        listQuery: {
          pageNum: 1,
          pageRow: 50,
          name: ''
        },
        tools: [],
        problems:[],
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: 'Update Reporter',
          create: 'Create Reporter'
        },
        tempReporter: {
         name: '',
         date:'',
         toolsId:'',
         problemsId:'',
         confirm:'',
         avatar:''
        }
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('reporter:add') || this.hasPerm('reporter:update')) {
          this.getAllTools();
          this.getAllProblems();
      }
    },
    methods: {
      getList() {
        if (!this.hasPerm('reporter:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/reporter/listReporter",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      getAllTools() {
        this.api({
          url: "/quality/listTools",
          method: "get"
        }).then(data => {
        this.tools = data.list;
        })
      },
       getAllProblems() {
         this.api({
           url: "/problems/listProblems",
           method: "get"
         }).then(data => {
           this.problems = data.list;
         })
       },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAvatarSuccess(res,file){
      let url = res.returnData.fileName;
      this.tempReporter.avatar = url;
      },

      showCreate() {
        this.tempReporter.name = "";
        this.tempReporter.date = "";
        this.tempReporter.toolsId = "";
        this.tempReporter.problemsId = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let reporter = this.list[$index];
        this.tempReporter.id = this.list[$index].id;
        this.tempReporter.name = reporter.name;
        this.tempReporter.date = reporter.date;
        this.tempReporter.toolsId = reporter.tools_id;
        this.tempReporter.problemsId = reporter.problems_id;
        this.tempReporter.confirm = '1'
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },

      createReporter() {
        this.api({
          url: "/reporter/addReporter",
          method: "post",
          data: this.tempReporter
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },

      updateReporter() {
        this.api({
          url: "/reporter/updateReporter",
          method: "post",
          data: this.tempReporter
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
    }
  }
</script>
