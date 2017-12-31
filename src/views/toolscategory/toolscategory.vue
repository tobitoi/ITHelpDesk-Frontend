 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('toolsCategory:add')">Add Category
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column align="center" label="No" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="category" label="Category Name" style="width: 60px;"></el-table-column>
       <el-table-column align="center" label="Create Time" prop="createTime" width="170"></el-table-column>
            <el-table-column align="center" label="Update Time" prop="updateTime" width="170"></el-table-column>
      <el-table-column align="center" label="Action" width="200" v-if="hasPerm('toolsCategory:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">edit</el-button>
           <el-button type="danger" icon="delete" @click="removeToolsCategory(scope.$index)">Remove
                    </el-button>
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
      <el-form class="small-space" :model="tempToolsCategory" label-position="left" label-width="120px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="Category Name">
          <el-input type="text" v-model="tempToolsCategory.category">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createCategoryTools">Create</el-button>
        <el-button type="primary" v-else @click="updateToolsCategory">Update</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0,
        list: [],
        listLoading: false,
        listQuery: {
          pageNum: 1,
          pageRow: 50,
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: 'Update Tools Category',
          create: 'Create Tools Category'
        },
        tempToolsCategory: {
          id: "",
          category: ""
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        if (!this.hasPerm('toolsCategory:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/toolsCategory/listToolsCategory",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList();
      },
      getIndex($index) {
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        this.tempToolsCategory.category = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let category = this.list[$index];
        this.tempToolsCategory = category;
        this.tempToolsCategory.category = this.list[$index].category;
        this.tempToolsCategory.delete_status = '1';
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createCategoryTools() {
        this.api({
          url: "/toolsCategory/addToolsCategory",
          method: "post",
          data: this.tempToolsCategory
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateToolsCategory() {
        let _vue = this;
        this.api({
          url: "/toolsCategory/updateToolsCategory",
          method: "post",
          data: this.tempToolsCategory
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      removeToolsCategory($index) {
        let _vue = this;
        this.$confirm('Delete Category tools?', 'Confirmation', {
          confirmButtonText: 'Ok',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let category = _vue.list[$index];
          category.delete_status = '2';
          _vue.api({
            url: "/toolsCategory/updateToolsCategory",
            method: "post",
            data: category
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("failed to delete")
          })
        })
       },
      }
     }
</script>
