 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('tools:add')">Add Tools
          </el-button>
           <input placeholder="Please input" v-model="searchFilterText"  @keyup="filterText"/>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column align="center" label="No" width="40">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
        <el-table-column align="center" prop="merk" label="Merk / Type" style="width: 60px;"></el-table-column>
        <el-table-column align="center" prop="host_name" label="Host Name" style="width: 60px;" ></el-table-column>
        <el-table-column prop="category" label="category" align="center"
          :filters="[{ text: 'HHT', value: 'HHT' }, { text: 'VMT', value: 'VMT' }, { text: 'PAGEER', value: 'PAGEER' }]"
          :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag type=success v-text="scope.row.category" v-if="scope.row.category==='HHT'"> close-transition>{{scope.row.category}}</el-tag>
              <el-tag type=danger v-text="scope.row.category" v-else-if="scope.row.category==='VMT'"> close-transition>{{scope.row.category}}</el-tag>
              <el-tag type="warning" v-text="scope.row.category" v-else></el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="ip_address" label="Ip Address" style="width: 60px;"></el-table-column>
        <el-table-column align="center" label="Status" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-text="scope.row.status" v-if="scope.row.status==='Ready'"></el-tag>
            <el-tag type="danger" v-text="scope.row.status" v-else-if="scope.row.status==='Broken'"></el-tag>
            <el-tag type="primary" v-text="scope.row.status" v-else></el-tag>
           </template>
        </el-table-column>
        <el-table-column align="center" prop="serial_number" label="Serial Number" style="width: 60px;"></el-table-column>
        <el-table-column align="center" label="Update Time" prop="updateTime" width="170"></el-table-column>
        <el-table-column align="center" label="Action" width="200" v-if="hasPerm('tools:update')">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">edit</el-button>
            <el-button type="danger" icon="delete" @click="removeTools(scope.$index)">Remove</el-button>
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
      <el-form class="small-space" :model="tempTools" label-position="left" label-width="120px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="Merk" required>
          <el-input type="text" v-model="tempTools.merk"></el-input>
        </el-form-item>
        <el-form-item label="Host Name" required>
           <el-input type="text" v-model="tempTools.hostName"></el-input>
        </el-form-item>
        <el-form-item label="Ip Address" required>
           <el-input type="text" v-model="tempTools.ipAddress"></el-input>
        </el-form-item>
        <el-form-item label="Category Tools" required>
          <el-select v-model="tempTools.categoryId" placeholder="please choose">
            <el-option
              v-for="item in category"
              :key="item.category_id"
              :label="item.category"
              :value="item.id">
            </el-option>
          </el-select>
         </el-form-item>
         <el-form-item label="Status" required>
           <el-select v-model="tempTools.statusId" placeholder="please choose">
            <el-option
              v-for="item in status"
              :key="item.status_id"
              :label="item.status"
              :value="item.id">
              </el-option>
            </el-select>
         </el-form-item>
        <el-form-item label="Serial Number" required>
           <el-input type="text" v-model="tempTools.serialNumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createTools">Create</el-button>
        <el-button type="primary" v-else @click="updateTools">Update</el-button>
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
        category: [],
        status: [],
        searchFilterText: "",
        tableClone: [],
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: 'Update Tools ',
          create: 'Create Tools'
        },
        tempTools: {
          merk: '',
          hostName: '',
          ipAddress: '',
          status: '',
          serialNumber: '',
          categoryId:'',
          statusId:''
        }
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('tools:add') || this.hasPerm('tools:update')) {
        this.getAllCategory();
        this.getAllStatus();
      }
    },
    mounted: function () {
      this.tableClone = this.list;
    },
    methods: {
      filterTag(value, row) {
        return row.category === value;
      },
      filterText(filters) {
        let me = this;
        let val = this.searchFilterText;
        let theFilters = filters["el-table_1_column_8"];
        this.list = this.tableClone;
          if (theFilters == undefined) {
            let inputs = document.querySelectorAll(
             ".el-checkbox__input.is-checked input"
            );
            theFilters = [];
            for (let i = 0; i < inputs.length; i++) {
              theFilters.push(inputs[i].value);
            }
          }
          this.list = this.list.filter(row => {
            if (!theFilters.length)
              return row.host_name.toLowerCase().indexOf(val.toLowerCase()) !== -1;
            else
              return (
               row.host_name.toLowerCase().indexOf(val.toLowerCase()) !== -1  &&
               theFilters.find(x => x == row.category) !== undefined
              );
          });
      },
      getAllCategory() {
        this.api({
          url: "/tools/listToolsCategory",
          method: "get"
        }).then(data => {
          this.category = data.list;
        })
      },
      getAllStatus() {
        this.api({
          url: "/tools/listStatus",
          method: "get"
        }).then(data => {
          this.status = data.list;
        })
      },
      getList() {
        if (!this.hasPerm('tools:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/tools/listTools",
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
        this.tempTools.merk = "";
        this.tempTools.hostName = "";
        this.tempTools.ipAddress = "";
        this.tempTools.status = "";
        this.tempTools.serialNumber = "";
        this.tempTools.categoryId = "";
        this.tempTools.statusId = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let tools = this.list[$index];
        this.tempTools.id = this.list[$index].id;
        this.tempTools.merk = tools.merk;
        this.tempTools.hostName = tools.host_name;
        this.tempTools.ipAddress = tools.ip_address;
        this.tempTools.status = tools.status;
        this.tempTools.serialNumber = tools.serial_number;
        this.tempTools.categoryId = tools.category_id;
        this.tempTools.statusId = tools.status_id;
        this.tempTools.delete_status = '1';
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createTools() {
        this.api({
          url: "/tools/addTools",
          method: "post",
          data: this.tempTools
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateTools() {
        let _vue = this;
        this.api({
          url: "/tools/updateTools",
          method: "post",
          data: this.tempTools
          }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
       },
      removeTools($index) {
        let _vue = this;
        this.$confirm('Delete tools?', 'Confirmation', {
          confirmButtonText: 'Ok',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let tools = _vue.list[$index];
          tools.delete_status = '2';
          _vue.api({
            url: "/tools/deleteTools",
            method: "post",
            data: tools
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
