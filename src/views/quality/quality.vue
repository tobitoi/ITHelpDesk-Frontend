 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('quality:add')">Add Quality
          </el-button>
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
        <el-table-column align="center" prop="reporter" label="Reporter" style="width: 60px;"></el-table-column>
         <el-table-column align="center" label="Tools Name" width="100">
            <template slot-scope="scope">
              <el-tag type="success" v-text="scope.row.host_name"></el-tag>
             </template>
        </el-table-column>
        <el-table-column align="center" prop="startDate" label="Date Start" style="width: 60px;"></el-table-column>
        <el-table-column align="center" prop="problem" label="Problem" style="width: 60px;"></el-table-column>
        <el-table-column align="center" prop="repair_desc" label="Desc Repair" style="width: 60px;"></el-table-column>
        <el-table-column align="center" prop="finishDate" label="Date Finish" style="width: 60px;"></el-table-column>
        <el-table-column align="center" label="Verify By" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-text="scope.row.verify_status" v-if="scope.row.verify_status==='Done'"></el-tag>
            <el-tag type="danger" v-text="scope.row.verify_status" v-else></el-tag>
           </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="Fix By" style="width: 60px;"></el-table-column>
        <el-table-column align="center" prop="diff" label="Duration" style="width: 60px;"></el-table-column>
        <el-table-column align="center" label="Action" width="200" v-if="hasPerm('quality:update')">
          <template slot-scope="scope">
            <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">edit</el-button>
            <el-button type="danger" icon="delete" @click="removeQuality(scope.$index)">Remove</el-button>
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
      <el-form class="small-space" :model="tempQuality" label-position="left" label-width="120px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="Reporter" style="width: 400px;" required>
          <el-input type="text" v-model="tempQuality.reporter"></el-input>
        </el-form-item>
        <el-form-item label="Date Start" style="width: 400px;"required v-if="dialogStatus=='create'">
           <el-date-picker type="datetime" v-model="tempQuality.dateStart"></el-date-picker>
        </el-form-item>
        <el-form-item label="Tools Name" style="width: 400px;" required>
          <el-select v-model="tempQuality.toolsId" placeholder="please choose">
            <el-option
              v-for="item in tools"
              :key="item.tools_id"
              :label="item.host_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Problem" style="width: 400px;" required>
            <el-input type="textarea" v-model="tempQuality.problem"></el-input>
        </el-form-item>
        <el-form-item label="Repair Desc" style="width: 400px;" required>
            <el-input type="textarea" v-model="tempQuality.repairDesc"></el-input>
        </el-form-item>
       <el-form-item label="Verified By" required>
          <el-select v-model="tempQuality.verifyStatus" placeholder="Gender">
              <el-option label="Done" value="Done"></el-option>
              <el-option label="Cannot Fix" value="Cannot Fix"></el-option>
          </el-select>
       </el-form-item>
        <el-form-item label="Fix By "  style="width: 400px;" required>
           <el-select v-model="tempQuality.employeeId" placeholder="please choose">
            <el-option
              v-for="item in employee"
              :key="item.employee_id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
         </el-form-item>
        <el-form-item label="Date Finish"  style="width: 400px;" >
            <el-date-picker type="datetime" v-model="tempQuality.dateFinish"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createQuality">Create</el-button>
        <el-button type="primary" v-else @click="updateQuality">Update</el-button>
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
        employee: [],
        tools: [],
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: 'Update Quality ',
          create: 'Create Quality'
        },
        tempQuality: {
          employeeId: '',
          toolsId: '',
          dateStart: '',
          dateFinish: '',
          problem: '',
          repairDesc:'',
          reporter:'',
          verifyStatus:''
        }
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('quality:add') || this.hasPerm('quality:update')) {
        this.getAllEmployee();
        this.getAllTools();
      }
    },
    methods: {
      getAllEmployee() {
        this.api({
          url: "/quality/listEmployee",
          method: "get"
        }).then(data => {
          this.employee = data.list;
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
      getList() {
        if (!this.hasPerm('tools:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/quality/listQuality",
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
        this.tempQuality.employeeId = "";
        this.tempQuality.dateStart = "";
        this.tempQuality.toolsId = "";
        this.tempQuality.problem = "";
        this.tempQuality.repairDesc = "";
        this.tempQuality.dateFinish = " ";
        this.tempQuality.reporter = "";
        this.tempQuality.verifyStatus = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let quality = this.list[$index];
        this.tempQuality.id = this.list[$index].id;
        this.tempQuality.employeeId = quality.employee_id;
        this.tempQuality.dateStart = quality.startDate;
        this.tempQuality.toolsId = quality.tools_id;
        this.tempQuality.problem = quality.problem;
        this.tempQuality.repairDesc = quality.repair_desc;
        this.tempQuality.dateFinish = quality.finishDate;
        this.tempQuality.reporter = quality.reporter;
        this.tempQuality.verifyStatus = quality.verify_status;
        this.tempQuality.delete_status = '1';
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createQuality() {
        this.api({
          url: "/quality/addQuality",
          method: "post",
          data: this.tempQuality
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateQuality() {
        let _vue = this;
        this.api({
          url: "/quality/updateQuality",
          method: "post",
          data: this.tempQuality
          }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
       },
      }
     }
</script>
