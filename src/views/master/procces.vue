<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
           <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('proccess:add')">Create</el-button>
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
      <el-table-column align="center" label="kode" prop="kode" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="Description" prop="description" style="width: 60px;"  ></el-table-column>
      <el-table-column align="center" label="Action" width="220" v-if="hasPerm('proccess:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">Edit</el-button>
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
      <el-form class="small-space" :model="tempProccess" label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="Kode" required>
          <el-input type="text" v-model="tempProccess.kode">
          </el-input>
        </el-form-item>
        <el-form-item label="Description"  required>
          <el-input type="text" v-model="tempProccess.description">
          </el-input>
        </el-form-item>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createProccess">Create</el-button>
        <el-button type="primary" v-else @click="updateProccess">Modify</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 50,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: 'Update Proccess',
          create: 'Create Proccess'
        },
        tempProccess: {
         kode: '',
         description: '',
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        if (!this.hasPerm('proccess:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/proccess/listProccess",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
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
      showCreate() {
        this.tempProccess.kode = "";
        this.tempProccess.description = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let proccess = this.list[$index];
        this.tempProccess.id = this.list[$index].id;
        this.tempProccess.kode = proccess.kode;
        this.tempProccess.description = proccess.description;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createProccess() {
        this.api({
          url: "/proccess/addProccess",
          method: "post",
          data: this.tempProccess
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateProccess() {
        this.api({
          url: "/proccess/updateProccess",
          method: "post",
          data: this.tempProccess
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
    }
  }
</script>
