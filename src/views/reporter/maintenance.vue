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
      <el-table-column align="center" label="Action" width="220" v-if="hasPerm('reporter:update')">
        <template slot-scope="scope">
         <el-button type="primary" :disabled="scope.row.confirm===1" @click="edit">Confirm</el-button>
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
         problemsId:''
        }
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('reporter:add') || this.hasPerm('reporter:update')) {
      }
    },
    methods: {
      getList() {
        if (!this.hasPerm('sparepart:list')) {
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
    }
  }
</script>
