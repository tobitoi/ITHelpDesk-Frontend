<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
           <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('sparepart:add')">Create</el-button>
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
      <el-table-column align="center" label="Name" prop="name" style="width: 60px;"  ></el-table-column>
      <el-table-column align="center" label="Action" width="220" v-if="hasPerm('sparepart:update')">
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
      <el-form class="small-space" :model="tempSparepart" label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="Kode" required>
          <el-input type="text" v-model="tempSparepart.kode">
          </el-input>
        </el-form-item>
        <el-form-item label="Name"  required>
          <el-input type="text" v-model="tempSparepart.name">
          </el-input>
        </el-form-item>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createSparepart">Create</el-button>
        <el-button type="primary" v-else @click="updateSparepart">Modify</el-button>
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
          update: 'Update Sparepart',
          create: 'Create Sparepart'
        },
        tempSparepart: {
         kode: '',
         name: ''
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        if (!this.hasPerm('sparepart:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/sparepart/listSparePart",
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
        this.tempSparepart.kode = "";
        this.tempSparepart.name = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let sparepart = this.list[$index];
        this.tempSparepart.id = this.list[$index].id;
        this.tempSparepart.kode = sparepart.kode;
        this.tempSparepart.name = sparepart.name;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createSparepart() {
        this.api({
          url: "/sparepart/addSparePart",
          method: "post",
          data: this.tempSparepart
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateSparepart() {
        this.api({
          url: "/sparepart/updateSparePart",
          method: "post",
          data: this.tempSparepart
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
    }
  }
</script>
