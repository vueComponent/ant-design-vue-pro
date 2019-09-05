<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
     <a-card :bordered="false" style="background-color: #0399EC;color:#FFFFFF">
       <a-row :gutter="30" style="line-height: 34px;">
         <a-col :md="1" :sm="4"><a-icon type="left" style="fontSize:20px;cursor: pointer;" @click="$router.back(-1)" /></a-col>
         <a-col :md="4" :sm="20" style="fontSize:20px">
           <a-icon type="credit-card" theme="filled" />
           受访者:{{patient.name}}
         </a-col>
         <a-col :md="6" :sm="24" style="fontSize:20px">
           <a-icon type="credit-card" theme="filled" style="fontSize:20px" />
           {{patient.card}}
         </a-col>
         <a-col :md="13" :sm="24" style="fontSize:20px;textAlign: right;">创建时间：{{patientBasis.createDate | moment}}</a-col>
       </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 20px;">
     <a-row :gutter="8">
       <a-col :span="5">
        <s-tree :treeTitle="title" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
        </s-tree>
       </a-col>
       <a-col :span="19">
         <div class="baselineForm">
              <div style="overflow: hidden;">
                <a-button class="btn fr" @click="showlog">导入</a-button>
                <a-button class="btn fr" @click="save">保存</a-button>
                <a-button class="btn fr" type="primary" @click="submit">提交</a-button>
              </div>
              <a-form :form="form">
                <a-form-item v-for="(qu1, index) in list" :key="index" :label="[qu1.sort + '.' + qu1.questionName]" :labelCol="qu1.type === 0 ? labelColVer : labelColHor" :wrapperCol="qu1.type === 0 ? wrapperVer : wrapperHor">
                    <a-radio-group v-if="qu1.simple === 1" :name="qu1.basisElementCopyId+''" v-model="qu1.basisElementId">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="-1">否</a-radio>
                    </a-radio-group>
                    <a-radio-group v-if="qu1.simple === 2" :name="qu1.basisElementCopyId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementNumValue">
                      <a-radio :value="1">有</a-radio>
                      <a-radio :value="-1">无</a-radio>
                    </a-radio-group>
                    <!-- <br v-if="qu1.simple > 0"> -->
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'compute'" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue" style="width: 240px" :addonAfter="qu1.unit" @blur="compute(qu1.computeElement)" />
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && !qu1.event && typeof qu1.computeElement !== 'undefined' && qu1.computeElement === 0" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue" style="width: 240px" :addonAfter="qu1.unit"  v-model="computeMap[qu1.basisElementCopyId]" />
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && !qu1.event && typeof qu1.computeElement === 'undefined'" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue" style="width: 240px" :addonAfter="qu1.unit" />
                    <a-date-picker :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate' && (!qu1.answers || qu1.answers.length === 0 || qu1.answers[0].elementTextValue === '')" />
                    <a-date-picker :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate' && (qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue)" :defaultValue="moment(qu1.answers[0].elementTextValue)" />
                    <a-checkbox-group v-if="qu1.hasChild > 0 && qu1.isRadio < 0 && (qu1.logicValue === 0 || (qu1.logicValue > 0 && qu1.basisElementId === 1))" v-model="qu1.elementId">
                      <a-checkbox  v-if="op.event!=='showList'" v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementCopyId" :name="qu1.basisElementCopyId+''">{{op.questionName}}</a-checkbox>
                    </a-checkbox-group>
                    <a-checkbox-group  v-if="qu1.hasChild > 0 && qu1.isRadio < 0 && (qu1.logicValue === 0 || qu1.basisElementId === 1) && qu1.childList[0].event === 'showList'" v-model="qu1.elementId" style="width: 80%;">
                      <span v-for="(op, index) in qu1.childList">
                        <a-checkbox v-if="op.event=='showList'" :name="qu1.basisElementCopyId+''"  @change="showList($event, op.event,op.questionName)" :key="index" :value="op.basisElementCopyId">{{op.questionName}}</a-checkbox>
                         <div  v-if="op.event=='showList' && qu1.elementId.indexOf(op.basisElementCopyId) > -1&&op.questionName=='其他' "  style="display: inline-block;width: 300px;">
                            <a-input :name="op.childList[0].basisElementCopyId+''" v-model="op.childList[0].childEleName" @blur="blurInput($event,op.childList[0])"  :addonAfter="op.childList[0].unit" :defaultValue="op.childList[0].answers && op.childList[0].answers.length && op.childList[0].answers[0].elementTextValue" style="width:240px" />
                         </div>
                         <add-table v-if="op.event=='showList' && qu1.elementId.indexOf(op.basisElementCopyId) > -1&&op.questionName!=='其他'"  v-model="optionDataSource[op.basisElementCopyId]" :dataSource="op.medicineAllergyList?op.medicineAllergyList:optionDataSource[op.basisElementCopyId]"></add-table>
                         <add-table v-if="op.event=='showList' &&op.questionName=='其他'&&op.childList&&op.childList[0].childEleName!=''&& qu1.elementId.indexOf(op.basisElementCopyId) > -1"  v-model="optionDataSource[op.childList[0].parentId]" :dataSource="op.medicineAllergyList?op.medicineAllergyList:optionDataSource[op.childList[0].parentId]"></add-table>   
                       </span>
                    </a-checkbox-group>
                    <div v-if="qu1.hasChild > 0 && qu1.isRadio > 0">
                      <a-radio-group :name="qu1.basisElementCopyId+''" v-model="qu1.basisElementId">
                        <a-radio v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementCopyId">{{op.questionName}}</a-radio>
                      </a-radio-group>
                      <div v-for="(sub, index) in qu1.childList" v-if="sub.hasChild > 0">
                        <a-row v-if="sub.isRadio > 0 && sub.logicValue > 0 && qu1.basisElementId === sub.basisElementCopyId">
                          <a-radio-group :name="sub.basisElementCopyId+''" v-model="sub.basisElementId">
                            <a-radio v-for="(third,index) in sub.childList" :key="index" :value="third.basisElementCopyId">{{third.questionName}}</a-radio>
                          </a-radio-group>
                        </a-row>
                        <a-row v-for="(third, index) in sub.childList" v-if="sub.isRadio === 0 && (sub.logicValue === 0 || (sub.logicValue > 0 && qu1.basisElementId === sub.basisElementCopyId))">
                          <a-col :span="6">({{third.sort}}) {{third.questionName}}</a-col>
                          <!-- <br> -->
                          <a-col :span="18">
                            <a-col :span="6" v-if="third.simple > 0 && third.isRadio < 0">
                              <a-radio-group v-if="third.simple === 1" :name="third.basisElementCopyId+''" v-model="third.basisElementId">
                                  <a-radio :value="1">是</a-radio>
                                  <a-radio :value="-1">否</a-radio>
                                </a-radio-group>
                                <a-radio-group v-if="third.simple === 2" :name="third.basisElementCopyId+''" v-model="third.basisElementId">
                                  <a-radio :value="1">有</a-radio>
                                  <a-radio :value="-1">无</a-radio>
                                </a-radio-group>
                            </a-col>
                            <a-col :span="8" v-if="third.simple > 0 && third.logicValue > 0 && third.hasChild > 0 && third.childList[0].isWrite > 0 && third.basisElementId === 1">
                              <a-input :name="third.childList[0].basisElementCopyId+''" :addonAfter="third.childList[0].unit" style="width:240px"></a-input>
                            </a-col>
                            <a-row v-for="(fourth, index) in third.childList" v-if="third.hasChild > 0 && third.isRadio === 0">
                              <a-col :span="6">{{fourth.questionName}}</a-col>
                              <a-col :span="6">
                                <a-radio-group v-if="fourth.simple === 1" :name="fourth.basisElementCopyId+''" v-model="fourth.basisElementId">
                                  <a-radio :value="1">是</a-radio>
                                  <a-radio :value="-1">否</a-radio>
                                </a-radio-group>
                                <a-radio-group v-if="fourth.simple === 2" :name="fourth.basisElementCopyId+''" v-model="fourth.basisElementId">
                                  <a-radio :value="1">有</a-radio>
                                  <a-radio :value="-1">无</a-radio>
                                </a-radio-group>
                              </a-col>
                              <a-col :span="12" v-if="fourth.logicValue === 0 || (fourth.logicValue > 0 && fourth.basisElementId === 1) && fourth.hasChild > 0 && fourth.childList[0].isWrite > 0">
                                <a-col :span="6">{{fourth.childList[0].questionName}}</a-col>
                                <a-col :span="12">
                                  <a-input :addonAfter="fourth.childList[0].unit" :name="fourth.childList[0].basisElementCopyId+''" style="width:240px"></a-input>
                                </a-col>
                              </a-col>
                            </a-row>
                          </a-col>
                        </a-row>
                      </div>
                    </div>
                    <!-- 一级联动 -->
                    <a-row v-for="(sub, index) in qu1.childList" :key="index" v-if="qu1.isRadio < 0 && sub.logicValue > 0 && qu1.elementId.indexOf(sub.basisElementCopyId) > -1">
                      <a-col :span="4">{{sub.childList[0].questionName}}</a-col>
                      <a-col :span="4"><a-input :name="sub.childList[0].basisElementCopyId+''" :addonAfter="sub.childList[0].unit" :defaultValue="sub.childList[0].answers && sub.childList[0].answers.length && sub.childList[0].answers[0].elementTextValue" style="width:240px" /></a-col>
                    </a-row>
                    <!-- 有第二层 -->
                    <div v-if="qu1.hasChild > 0 && qu1.isRadio === 0">
                      <a-row v-for="(sub, index) in qu1.childList" :key="index" :class="{'no-border': index === qu1.childList.length - 1}" v-if="qu1.logicValue === 0 || (qu1.logicValue > 0 && qu1.basisElementId === 1)">
                        <!-- 第二层开始 -->
                        <a-col :span="sub.questionName.length > 16 ? 24 : 6">({{sub.sort}}) {{sub.questionName}}</a-col>
                        <!-- 为了体格检查中的啰音的排版 -->
                        <!-- <br v-if="sub.showType === 2 && sub.hasChild > 0 && sub.isRadio === 0 && sub.simple < 0 && sub.isWrite < 0"> -->
                        <a-col :span="18" :class="{'ant-col-push-6': sub.questionName.length > 16}">
                          <!-- 是否，有无以及填写值 -->
                          <a-col :span="6" v-if="sub.isWrite > 0">
                            <a-input v-if="sub.isWrite > 0 && !sub.event && typeof sub.computeElement !== 'undefined' && sub.computeElement === 0" :name="sub.basisElementCopyId+''" :defaultValue="sub.answers && sub.answers.length && sub.answers[0].elementTextValue" :addonAfter="sub.unit" :readOnly="sub.computeElement === 0" v-model="computeMap[sub.basisElementCopyId]" style="width:240px" />
                            <a-input v-if="sub.isWrite > 0 && !sub.event && typeof sub.computeElement === 'undefined'" :name="sub.basisElementCopyId+''" :defaultValue="sub.answers && sub.answers.length && sub.answers[0].elementTextValue" :addonAfter="sub.unit" style="width:240px" />
                            <a-input v-if="sub.isWrite > 0 && sub.event === 'compute'" :name="sub.basisElementCopyId+''" :defaultValue="sub.answers && sub.answers.length && sub.answers[0].elementTextValue" :addonAfter="sub.unit" @blur="compute(sub.computeElement)" style="width:240px" />
                            <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate' && (!sub.answers || sub.answers.length === 0 || sub.answers[0].elementTextValue === '')" :name="sub.basisElementCopyId+''" style="width:240px" />
                            <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate' && sub.answers && sub.answers.length && sub.answers[0].elementTextValue" :name="sub.basisElementCopyId+''" :defaultValue="moment(sub.answers[0].elementTextValue)" style="width:240px" />
                          </a-col>
                          <!-- <br v-if="sub.isWrite > 0"> -->
                          <a-radio-group v-if="sub.simple === 1" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="-1">否</a-radio>
                          </a-radio-group>
                          <a-radio-group v-if="sub.simple === 2" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''">
                            <a-radio :value="1">有</a-radio>
                            <a-radio :value="-1">无</a-radio>
                          </a-radio-group>
                          <!--   -->
                          <!-- <br v-if="sub.showType === 2" /> -->
                          <div class="clear" v-if="sub.simple > 0"></div>
                          <a-col :span="6" v-if="(sub.logicValue === 0 || sub.basisElementId === 1) && sub.childEleName">{{sub.childEleName}}</a-col>
                          <a-checkbox-group v-if="sub.hasChild > 0 && sub.isRadio < 0 &&(sub.logicValue === 0 || sub.basisElementId === 1) && sub.childList[0].event !== 'showList'" v-model="sub.elementId">
                            <a-checkbox v-for="(subOp,index) in sub.childList" :key="index" :name="subOp.parentId+''" :value="subOp.basisElementCopyId">{{subOp.questionName}}</a-checkbox>
                          </a-checkbox-group>
                          <a-checkbox-group v-if="sub.hasChild > 0 && sub.isRadio < 0 && sub.childList[0].event === 'showList'" v-model="sub.elementId" style="width: 80%;">
                           <span v-for="(subOp, index) in sub.childList">
                             <a-checkbox v-if="subOp.event=='showList'" :name="subOp.parentId+''"    @change="showList($event,subOp.event,subOp.questionName)" :key="index" :value="subOp.basisElementCopyId">{{subOp.questionName}}</a-checkbox>
                             <div  v-if="subOp.event=='showList' && sub.elementId.indexOf(subOp.basisElementCopyId) > -1&&subOp.questionName=='其他' "  style="display: inline-block;width: 300px;">
                                <a-input :name="subOp.childList[0].basisElementCopyId+''" v-model="subOp.childList[0].answers && subOp.childList[0].answers.length&&subOp.childList[0].answers[0].elementTextValue" @blur="blurInput($event,subOp.childList[0])"  :addonAfter="subOp.childList[0].unit"  />
                             </div>
                             <add-table v-if="subOp.event=='showList' && sub.elementId.indexOf(subOp.basisElementCopyId) > -1&&subOp.questionName!=='其他'"  v-model="optionDataSource[subOp.basisElementCopyId]" :dataSource=" subOp.medicineAllergyList?subOp.medicineAllergyList:optionDataSource[subOp.basisElementCopyId]"></add-table>
                             <add-table v-if="subOp.event=='showList' &&subOp.questionName=='其他'&&subOp.childList&&subOp.childList[0].answers!=''&& sub.elementId.indexOf(subOp.basisElementCopyId) > -1"  v-model="optionDataSource[subOp.childList[0].parentId]" :dataSource="subOp.medicineAllergyList?subOp.medicineAllergyList:optionDataSource[subOp.childList[0].parentId]"></add-table>
                           </span>
                          </a-checkbox-group>
                          <!-- 二级联动 -->
                          <a-row v-for="(third, index) in sub.childList" :key="index" v-if="sub.hasChild > 0 && sub.isRadio < 0 && third.hasChild > 0 && third.logicValue > 0 && sub.elementId.indexOf(third.basisElementCopyId) > -1" class="no-border">
                            <a-col :span="6" v-if="third.childList[0].isWrite > 0">{{third.childList[0].questionName}}</a-col>
                            <a-col :span="8" v-if="third.childList[0].isWrite > 0">
                              <a-date-picker v-if="third.childList[0].event === 'showDate' && third.childList[0].answers && third.childList[0].answers.length && third.childList[0].answers[0].elementTextValue" :defaultValue="moment(third.childList[0].answers[0].elementTextValue)" :name="third.childList[0].basisElementCopyId+''" style="width:240px" />
                              <a-date-picker v-if="third.childList[0].event === 'showDate' && (!third.childList[0].answers || !third.childList[0].answers.length || !third.childList[0].answers[0].elementTextValue)" :name="third.childList[0].basisElementCopyId+''" style="width:240px" />
                              <a-input v-if="!third.childList[0].event&&third.event!=='showList'" :addonAfter="third.childList[0].unit" :name="third.childList[0].basisElementCopyId+''" :defaultValue="third.childList[0].answers && third.childList[0].answers.length && third.childList[0].answers[0].elementTextValue" style="width:240px" />
                            </a-col>
                            <a-col :span="6" v-if="third.isRadio > 0 && third.hasChild > 0">{{third.questionName}}</a-col>
                            <a-col :span="16" v-if="third.isRadio > 0 && third.hasChild > 0">
                              <a-radio-group :name="third.basisElementCopyId+''" v-model="third.basisElementId">
                                <a-radio v-for="(fourth, index) in third.childList" :key="index" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-radio>
                              </a-radio-group>
                            </a-col>
                          </a-row>
                          <a-radio-group v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.childList[0].event === 'compute'" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''" @change="compute(sub.childList[0].computeElement)">
                            <a-radio v-for="(subOp,index) in sub.childList" :value="subOp.basisElementCopyId" :key="index">{{subOp.questionName}}</a-radio>
                          </a-radio-group>
                          <a-radio-group v-if="sub.hasChild > 0 && sub.isRadio > 0 && (!sub.childList[0].event || sub.childList[0].event !== 'compute')" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''">
                            <a-radio v-for="(subOp,index) in sub.childList" :value="subOp.basisElementCopyId" :key="index">{{subOp.questionName}}</a-radio>
                          </a-radio-group>
                          <!-- <a-row v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue === 0 && thirdSub.logicValue > 0 && thirdSub.hasChild > 0 && thirdSub.basisElementCopyId === sub.basisElementId" v-for="(thirdSub, index) in sub.childList" :class="{'no-border': index === sub.childList.length - 1}">
                            <a-col :span="6">{{thirdSub.childList[0].questionName}}todo</a-col>
                            <a-col :span="8">
                              <a-date-picker v-if="thirdSub.childList[0].event === 'showDate' && thirdSub.childList[0].answers && thirdSub.childList[0].answers.length && thirdSub.childList[0].answers[0].elementTextValue" :defaultValue="moment(thirdSub.childList[0].answers[0].elementTextValue)" :name="thirdSub.childList[0].basisElementCopyId+''" style="width:240px" />
                              <a-date-picker v-if="thirdSub.childList[0].event === 'showDate' && (!thirdSub.childList[0].answers || !thirdSub.childList[0].answers.length || !thirdSub.childList[0].answers[0].elementTextValue)" :name="thirdSub.childList[0].basisElementCopyId+''" style="width:240px" />
                              <a-input v-if="!thirdSub.childList[0].event" :addonAfter="thirdSub.childList[0].unit" :defaultValue="thirdSub.childList[0].answers && thirdSub.childList[0].answers.length && thirdSub.childList[0].answers[0].elementTextValue" style="width:240px" />
                            </a-col>
                          </a-row> -->
                          <div v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue === 0 && thirdSub.logicValue > 0 && thirdSub.hasChild > 0 && thirdSub.basisElementCopyId === sub.basisElementId" v-for="(thirdSub, index) in sub.childList">
                            <div v-if="thirdSub.isRadio === 0">
                              <a-row v-for="(fourth, index) in thirdSub.childList" :class="{'no-border': index === thirdSub.childList.length - 1}">
                                <a-col :span="6">{{fourth.questionName}}</a-col>
                                <a-radio-group v-if="fourth.simple === 2" v-model="fourth.basisElementId" :name="fourth.basisElementCopyId+''">
                                  <a-radio :value="1">有</a-radio>
                                  <a-radio :value="-1">无</a-radio>
                                </a-radio-group>
                                <a-input v-if="fourth.isWrite > 0" :addonAfter="fourth.unit" :name="fourth.basisElementCopyId+''" :defaultValue="fourth.answers && fourth.answers.length && fourth.answers[0].elementTextValue" style="width: 240px"></a-input>
                                <div v-if="fourth.hasChild > 0 && fourth.isRadio === 0">
                                  <a-row class="no-border" v-for="fifth in fourth.childList" v-if="fourth.logicValue === 0 || fourth.basisElementId === 1">
                                    <a-col :span="6">{{fifth.questionName}}</a-col>
                                    <a-col :span="4" v-if="fifth.simple === 2">
                                      <a-radio-group v-model="fifth.basisElementId" :name="fifth.basisElementCopyId+''">
                                        <a-radio :value="1">有</a-radio>
                                        <a-radio :value="-1">无</a-radio>
                                      </a-radio-group>
                                    </a-col>
                                    <div v-if="fifth.hasChild > 0 && (fifth.logicValue === 0 || fifth.basisElementId === 1) && fifth.isRadio === 0">
                                      <a-col :span="4">{{fifth.childList[0].questionName}}</a-col>
                                      <a-input v-if="fifth.childList[0].isWrite > 0" :span="8" style="width: 240px" :name="fifth.childList[0].basisElementCopyId+''" :defaultValue="fifth.childList[0].answers && fifth.childList[0].answers.length && fifth.childList[0].answers[0].elementTextValue" :addonAfter="fifth.childList[0].unit"></a-input>
                                    </div>
                                    <a-col :span="4" v-if="fifth.isWrite > 0">
                                      <a-input :name="fifth.basisElementCopyId+''" :addonAfter="fifth.unit" :defaultValue="fifth.answers && fifth.answers[0].length && fifth.answers[0].elementTextValue" style="width:240px"></a-input>
                                    </a-col>
                                  </a-row>
                                </div>
                              </a-row>
                            </div>
                            <div v-if="thirdSub.isRadio > 0">
                              <a-row class="no-border">
                                <a-radio-group :name="thirdSub.basisElementCopyId+''" v-model="thirdSub.basisElementId">
                                  <a-radio v-for="fourth in thirdSub.childList" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-radio>
                                </a-radio-group>
                              </a-row>
                            </div>
                          </div>
                          <a-col v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.childList[0].isWrite > 0">
                            <a-col :span="6">{{sub.childList[0].questionName}}</a-col>
                            <a-col :span="8"><a-input :name="sub.childList[0].basisElementCopyId+''" style="width:240px" /></a-col>
                          </a-col>
                          <a-row class="no-border" v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue > 0 && secondSub.hasChild > 0" v-for="(secondSub, index) in sub.childList" :key="index">
                            <a-col :span="3" v-if="sub.basisElementId === secondSub.basisElementId">{{secondSub.childList[0].questionName}}</a-col>
                            <a-col :span="8" v-if="sub.basisElementId === secondSub.basisElementId"><a-input :addonAfter="secondSub.childList[0].unit" :defaultValue="secondSub.childList[0].answers && secondSub.childList[0].answers.length && secondSub.childList[0].answers[0].elementTextValue" :name="secondSub.childList[0].basisElementCopyId+''" style="width:240px" /></a-col>
                          </a-row>
                          <a-row v-if="sub.hasChild > 0 && sub.isRadio === 0 && (sub.logicValue === 0 || sub.basisElementId === 1)" v-for="(subOp,index) in sub.childList" :class="{'ant-col-pull-8': subOp.level > 3 || subOp.display > 0, 'no-border': index === sub.childList.length - 1}">
                            <!-- <br> -->
                              <!-- 调脂那一层,如果是紧跟后面的单选框或者输入框就占8格；否则就是子问题，占12格 -->
                              <a-col :span="subOp.simple > 0 || subOp.isWrite > 0 ? 6 : 12">{{subOp.questionName}}</a-col>
                              <a-radio-group v-if="subOp.simple === 1" v-model="subOp.basisElementId" :name="subOp.basisElementCopyId+''">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="-1">否</a-radio>
                              </a-radio-group>
                              <a-radio-group v-if="subOp.simple === 2" v-model="subOp.basisElementId" :name="subOp.basisElementCopyId+''">
                                <a-radio :value="1">有</a-radio>
                                <a-radio :value="-1">无</a-radio>
                              </a-radio-group>
                              <a-col :span="6" v-if="subOp.isWrite > 0">
                                <a-date-picker v-if="subOp.event === 'showDate' && subOp.answers && subOp.answers.length && subOp.answers[0].elementTextValue" :name="subOp.basisElementCopyId+''" :defaultValue="moment(subOp.answers[0].elementTextValue)" style="width:240px" />
                                <a-date-picker v-if="subOp.event === 'showDate' && (!subOp.answers || !subOp.answers.length || !subOp.answers[0].elementTextValue)" :name="subOp.basisElementCopyId+''" style="width:240px" />
                                <a-input :name="subOp.basisElementCopyId+''" v-if="!subOp.event || subOp.event !== 'showDate'" :defaultValue="subOp.answers && subOp.answers.length && subOp.answers[0].elementTextValue" :addonAfter="subOp.unit" style="width:240px" />
                              </a-col>
                              <a-col :span="24" v-if="subOp.hasChild > 0 && subOp.isRadio < 0 && (subOp.logicValue === 0 || subOp.basisElementId === 1)">
                                <a-checkbox-group v-model="subOp.elementId" v-if="subOp.childList[0].event !== 'showList'">
                                  <a-checkbox v-for="(secondSub,index) in subOp.childList" :key="index" :name="secondSub.parentId+''" :value="secondSub.basisElementCopyId">{{secondSub.questionName}}</a-checkbox>
                                </a-checkbox-group>
                                <a-checkbox-group v-if="subOp.hasChild > 0 && subOp.isRadio < 0&& (subOp.logicValue === 0 || subOp.basisElementId === 1) && subOp.childList[0].event === 'showList'" v-model="subOp.elementId" style="width: 100%;">
                                  <span v-for="(secondSub, index) in subOp.childList" >
                                    <a-checkbox v-if="secondSub.event=='showList'"  :name="secondSub.parentId+''" @change="showList($event,secondSub.event,secondSub.questionName)" :key="index" :value="secondSub.basisElementCopyId">{{secondSub.questionName}}</a-checkbox>
                                    <div  v-if="secondSub.event=='showList' && subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1&&secondSub.questionName=='其他' "  style="display: inline-block;width: 300px;">
                                       <a-input :name="secondSub.childList[0].basisElementCopyId+''"  @blur="blurInput($event,secondSub.childList[0])"  :addonAfter="secondSub.childList[0].unit" v-model="secondSub.childList[0].answers && secondSub.childList[0].answers.length && secondSub.childList[0].answers[0].elementTextValue" />
                                    </div>
                                    <add-table v-if="secondSub.event=='showList' && subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1&&secondSub.questionName!=='其他'"  v-model="optionDataSource[secondSub.basisElementCopyId]" :dataSource="secondSub.medicineAllergyList?secondSub.medicineAllergyList:optionDataSource[secondSub.basisElementCopyId]"></add-table>
                                    <add-table v-if="secondSub.event=='showList' &&secondSub.questionName=='其他'&& subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1"  v-model="optionDataSource[secondSub.childList[0].parentId]" :dataSource="secondSub.medicineAllergyList?secondSub.medicineAllergyList:optionDataSource[secondSub.childList[0].parentId]"></add-table>
                                  </span>
                                 </a-checkbox-group>
                              </a-col>
                              <div v-if="subOp.hasChild > 0 && subOp.isRadio < 0 && (subOp.logicValue === 0 || subOp.basisElementId === 1) && subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1" v-for="(secondSub, index) in subOp.childList" :key="index">
                                <div v-if="secondSub.hasChild > 0 && secondSub.isRadio === 0">
                                  <a-row v-for="(thirdSub, index) in secondSub.childList" class="no-border">
                                    <a-col :span="6" v-if="thirdSub.questionName">{{thirdSub.questionName}}</a-col>
                                    <a-col :span="8" v-if="thirdSub.isWrite > 0">
                                      <a-input style="width: 240px;" :name="thirdSub.basisElementCopyId+''" :defaultValue="thirdSub.answers && thirdSub.answers.length && thirdSub.answers[0].elementTextValue" v-if="!thirdSub.event" :addonAfter="thirdSub.unit"></a-input>
                                      <a-date-picker v-if="thirdSub.event === 'showDate' && thirdSub.answers && thirdSub.answers.length && thirdSub.answers[0].elementTextValue" :name="thirdSub.basisElementCopyId+''" :defaultValue="moment(thirdSub.answers[0].elementTextValue)" style="width:240px" />
                                      <a-date-picker v-if="thirdSub.event === 'showDate' && (!thirdSub.answers || !thirdSub.answers.length || !thirdSub.answers[0].elementTextValue)" :name="thirdSub.basisElementCopyId+''" style="width:240px" />
                                    </a-col>
                                  </a-row>
                                </div>
                                <div v-if="secondSub.hasChild > 0 && secondSub.isRadio > 0">
                                  <a-row class="no-border">
                                    <a-col :span="6">{{secondSub.questionName}}</a-col>
                                    <a-radio-group v-model="secondSub.basisElementId" :name="secondSub.basisElementCopyId+''">
                                      <a-radio v-for="(thirdSub, index) in secondSub.childList" :value="thirdSub.basisElementCopyId" :key="index">{{thirdSub.questionName}}</a-radio>
                                    </a-radio-group>
                                  </a-row>
                                </div>
                              </div>
                              <!-- <a-col :span="6" v-if="secondSub.hasChild > 0 && (secondSub.logicValue === 0 || subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1) && secondSub.isWrite > 0" v-for="(secondSub,index) in subOp.childList">
                                <a-input style="width:240px;" :name="secondSub.basisElementCopyId+''" :defaultValue="secondSub.answers && secondSub.answers.length && secondSub.answers[0].elementTextValue"></a-input>
                              </a-col> -->
                              <a-col :span="24" v-if="subOp.hasChild > 0 && subOp.isRadio > 0">
                                <a-radio-group :name="subOp.basisElementCopyId+''" v-model="subOp.basisElementId">
                                  <a-radio v-for="(secondSub,index) in subOp.childList" :key="index" :value="secondSub.basisElementId">{{secondSub.questionName}}</a-radio>
                                </a-radio-group>
                              </a-col>
                              <div v-for="(secondSub, index) in subOp.childList" v-if="subOp.hasChild > 0 && subOp.isRadio > 0 && secondSub.hasChild > 0 && secondSub.isRadio === 0 && (secondSub.logicValue === 0 || subOp.basisElementId === secondSub.basisElementCopyId)">
                                <a-col v-for="(thirdSub,index) in secondSub.childList">
                                  <a-col :span="6">{{thirdSub.questionName}}</a-col>
                                  <a-col :span="6" v-if="thirdSub.isWrite > 0">
                                    <a-input :name="thirdSub.basisElementCopyId+''" :defaultValue="thirdSub.answers && thirdSub.answers.length && thirdSub.answers[0].elementTextValue" style="width:240px" :addonAfter="thirdSub.unit"></a-input>
                                  </a-col>
                                </a-col>
                              </div>
                              <a-row v-if="subOp.hasChild > 0 && subOp.isRadio === 0  && (!subOp.logicValue || subOp.basisElementId === 1)" v-for="(thirdSub, index) in subOp.childList" :key="index" class="no-border">
                                <a-col :span="6">{{thirdSub.questionName}}</a-col>
                                <a-col :span="16">
                                  <a-radio-group v-if="thirdSub.simple === 1" :name="thirdSub.basisElementCopyId+''" v-model="thirdSub.basisElementId">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="-1">否</a-radio>
                                  </a-radio-group>
                                  <a-date-picker v-if="thirdSub.event === 'showDate' && thirdSub.answers && thirdSub.answers.length && thirdSub.answers[0].elementTextValue" :defaultValue="moment(thirdSub.answers[0].elementTextValue)" :name="thirdSub.basisElementCopyId+''" style="width:240px" />
                                  <a-date-picker v-if="thirdSub.event === 'showDate' && (!thirdSub.answers || !thirdSub.answers.length || !thirdSub.answers[0].elementTextValue)" :name="thirdSub.basisElementCopyId+''" style="width:240px" />
                                  <a-input v-if="thirdSub.isWrite > 0 && !thirdSub.event" :name="thirdSub.basisElementCopyId + ''" :defaultValue="thirdSub.answers && thirdSub.answers.length && thirdSub.answers[0].elementTextValue" style="width:240px" :addonAfter="thirdSub.unit" />
                                    <!-- 注掉br是因为啰音类型会掉下去，别处需要换行再调整 -->
                                  <!-- <br v-if="thirdSub.hasChild > 0 && thirdSub.isRadio > 0 && thirdSub.simple > 0"> -->
                                  <a-radio-group v-if="thirdSub.hasChild > 0 && thirdSub.isRadio > 0 && (thirdSub.logicValue === 0 || thirdSub.basisElementId === 1)" :name="thirdSub.basisElementCopyId+''" v-model="thirdSub.basisElementId">
                                    <a-radio v-for="(fourth, index) in thirdSub.childList" :key="index" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-radio>
                                  </a-radio-group>
                                  <div v-if="thirdSub.hasChild > 0 && thirdSub.isRadio > 0 && (thirdSub.logicValue === 0 || thirdSub.basisElementId === 1)">
                                    <div v-for="(fourth, index) in thirdSub.childList" :key="index" v-if="fourth.hasChild > 0 && fourth.isRadio === 0 && (fourth.logicValue === 0 || thirdSub.basisElementId === fourth.basisElementCopyId)">
                                      <a-row class="no-border">
                                        <a-col :span="6">{{fourth.childList[0].questionName}}</a-col>
                                        <a-col :span="16" v-if="fourth.childList[0].isWrite > 0">
                                          <a-input :name="fourth.childList[0].basisElementCopyId+''" style="width: 240px;" :defaultValue="fourth.childList[0].answers && fourth.childList[0].answers.length && fourth.childList[0].answers[0].elementTextValue" :addonAfter="fourth.childList[0].unit"></a-input>
                                        </a-col>
                                      </a-row>
                                    </div>
                                  </div>
                                  <a-checkbox-group v-if="thirdSub.isRadio < 0 && thirdSub.hasChild > 0" v-model="thirdSub.elementId">
                                    <a-checkbox v-for="(fourth,index) in thirdSub.childList" :key="index" :name="fourth.parentId+''" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-checkbox>
                                  </a-checkbox-group>
                                  <div v-if="thirdSub.hasChild > 0 && thirdSub.isRadio === 0 && (thirdSub.logicValue === 0 || thirdSub.basisElementId === 1)">
                                    <a-row v-for="(fourth, index) in thirdSub.childList" :key="index" class="ant-col-pull-12 no-border">
                                      <a-col :span="12">{{fourth.questionName}}</a-col>
                                      <a-col :span="12">
                                        <a-radio-group v-if="fourth.simple === 1" :name="fourth.basisElementCopyId+''" v-model="fourth.basisElementId">
                                          <a-radio :value="1">是</a-radio>
                                          <a-radio :value="-1">否</a-radio>
                                        </a-radio-group>
                                      </a-col>
                                    </a-row>
                                  </div>
                                </a-col>
                              </a-row>
                          </a-row>
                        </a-col>
                      </a-row>
                    </div>
                </a-form-item>
              </a-form>
         </div>         
       </a-col>
     </a-row>
     </a-card>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { mapActions } from 'vuex'
import { getPatientBasis, getElementsAnswer, submit,getMedicineAllergyList,computeScore } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import AddTable from "./model/table"
export default {
  name: 'success',
  components: {
    STree,
    AddTable
  },
  data() {
    return {
      optionDataSource:[],
      checkedList:[],
      title: '',
      openKeys: ['key-01'],
      orgTree: [],
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6}
      },
      labelColVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24}
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      visible: false,
      confirmLoading: false,
      patient: {},
      patientBasis: {},
      list: [],
      patientBasisId: this.$route.params.id,
      basisMaskId: undefined,
      validateFlag: false,
      computeMap: {
        1208: '',
        2727: '', 
        1160: '' ,
        4207: ''
      }
    }
  },
  beforeCreate (){
    this.form = this.$form.createForm(this, {onFieldsChange: this.onFieldsChange, onValuesChange: this.onValuesChange})
  },
  created() {
    var that = this
    this.CloseSidebar()
    // this.compute = _.debounce(this.compute, 300) //节流阀
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
    .then(res => {
      that.patient = res.data.patient
      that.patientBasis = res.data.patientBasis
      that.orgTree = res.data.list
      if(that.patientBasis.type === 1){
        that.title = '支扩研究基线表'
      }else if(that.patientBasis.type === 2){
        that.title = '支扩研究随访表'
      }else if(that.patientBasis.type === 3){
        that.title = '支扩研究访视表'
      }
    })
  },
  computed: {
    validate() {
      return function(index){
        if(!this.validateFlag) return ''
        var first = this.list[index]
        if(first.required > 0) return 'error'
      }
    }
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    showList(e,type,name){
      if(type !== 'showList') return;
      if(e.target.checked){
        if(name=="其他") return;
        this.getMedicineAllergyList(name,e.target.value)
      }else{
         this.$set(this.optionDataSource,e.target.value,[])
      }
       
    },
    showlog(){
      console.log(this.optionDataSource);
        const allergy=[]
       for(var key in this.optionDataSource){
          _.each(this.optionDataSource[key], function(item){
            allergy.push({
              basisElementId:key,
              microbeName:item.microbeName,
              antibiotic:item.antibiotic,
              antibioticResult:item.antibioticResult,
              allergyValue:item.allergyValue
            })
          })
      }
      console.log(allergy);
    },
    getMedicineAllergyList(value,index){
       const that = this
       const params = new URLSearchParams()
       params.append('microbeName', value)
       getMedicineAllergyList(params).then(res => {
        const  optionDataSource = _.map(res.data, function(v) {
          return {
            keyW: v.keyW,
            microbeName: v.microbeName,
            antibiotic: v.antibiotic,
            antibioticResult: v.antibioticResult,
            allergyValue: v.allergyValue
          };
       })   
        that.$set(that.optionDataSource,index, optionDataSource)
      }) 
    },
    blurInput(e,item){
      console.log("e.target.value",e.target.name)
       this.getMedicineAllergyList(e.target.value,item.parentId)
    },
    handleClick(e) {
      this.basisMaskId = e.key
      this.getElementsAnswer()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    getElementsAnswer (){
      var that = this
      var params = new URLSearchParams()
      params.append('basisMaskId', this.basisMaskId)
      params.append('patientBasisId', this.patientBasisId)
      getElementsAnswer(params)
      .then(res => {
        that.list = that.initList(res.data)
        // that.logicList = _.filter(_.flatten(_.map(res.data, function(v){return _.flatMap(v)})),function(v){return v.logicValue > 0})
      })
    },
    generateAnswers (){
      var result = []
      _.each(this.list, function(item){
        if(item.simple > 0){
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementNumValue: typeof $('input[name="' + item.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + item.basisElementCopyId + '"]:checked').val() : '',
            elementTextValue: ''
          })
        }else if(item.isWrite > 0){
          var text = $('[name="' + item.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + item.basisElementCopyId + '"] input').val() : $('[name="' + item.basisElementCopyId + '"]').val()
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementTextValue: text,
            elementNumValue: ''
          }) 
        }
        if(item.hasChild > 0){
          if(item.childList[0].type === 1){
            _.each(item.childList, function(sub){
              if(sub.isWrite > 0){
                var text = $('[name="' + sub.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sub.basisElementCopyId + '"] input').val() : $('[name="' + sub.basisElementCopyId + '"]').val()
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementTextValue: text,
                  elementNumValue: ''
                })
              }
              if(sub.simple > 0){
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: typeof $('input[name="' + sub.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + sub.basisElementCopyId + '"]:checked').val() : '',
                  elementTextValue: ''
                })
              }
              
              if(sub.hasChild > 0){
                if(sub.isRadio !== 0){
                  _.each(sub.childList, function(third){
                    result.push({
                      basisAnswerId: third.answers && third.answers.length ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: $('[value="' + third.basisElementCopyId + '"][name="' + third.parentId + '"]').prop('checked') ? 1 : -1,
                      elementTextValue: ''
                    })
                  })
                }
                _.each(sub.childList, function(third){
                  if(third.simple > 0){
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: typeof $('input[name="' + third.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + third.basisElementCopyId + '"]:checked').val() : '',
                      elementTextValue: ''
                    })
                  }
                  if(third.isWrite > 0){
                    var text = $('[name="' + third.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + third.basisElementCopyId + '"] input').val() : $('[name="' + third.basisElementCopyId + '"]').val()
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementTextValue: text || '',
                      elementNumValue: ''
                    })
                  }
                  if(third.hasChild > 0){
                    
                    _.each(third.childList,function(fourth){
                      if(third.isRadio !== 0){
                        result.push({
                          basisAnswerId: fourth.answers && fourth.answers.length ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: $('[value="' + fourth.basisElementCopyId + '"][name="' + fourth.parentId + '"]').prop('checked') ? 1 : -1,
                          elementTextValue: ''
                        })
                      }
                      if(fourth.simple > 0){
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: typeof $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() : '',
                          elementTextValue: ''
                        })
                      }
                      if(fourth.isWrite > 0){
                        var text = $('[name="' + fourth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fourth.basisElementCopyId + '"] input').val() : $('[name="' + fourth.basisElementCopyId + '"]').val()
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementTextValue: text || '',
                          elementNumValue: ''
                        })
                      }
                      if(fourth.hasChild > 0 && fourth.isRadio === 0){
                        _.each(fourth.childList, function(fifth){
                          if(fifth.isWrite > 0){
                            var text = $('[name="' + fifth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fifth.basisElementCopyId + '"] input').val() : $('[name="' + fifth.basisElementCopyId + '"]').val()
                            result.push({
                              basisAnswerId: (fifth.answers && fifth.answers.length) ? fifth.answers[0].basisAnswerId : '',
                              basisElementId: fifth.basisElementCopyId,
                              elementTextValue: text || '',
                              elementNumValue: ''
                            })
                          }
                        })
                      }else if(fourth.hasChild > 0 && fourth.isRadio !== 0){
                        _.each(fourth.childList, function(fifth){
                          result.push({
                            basisAnswerId: fifth.answers && fifth.answers.length ? fifth.answers[0].basisAnswerId : '',
                            basisElementId: fifth.basisElementCopyId,
                            elementNumValue: $('[value="' + fifth.basisElementCopyId + '"][name="' + fifth.parentId + '"]').prop('checked') ? 1 : -1,
                            elementTextValue: ''
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
          }else{
            // 是选项，单选或多选
            if(item.isRadio !== 0){
              _.each(item.childList, function(sub){
                result.push({
                  basisAnswerId: sub.answers && sub.answers.length ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: $('[value="' + sub.basisElementCopyId + '"][name="' + sub.parentId + '"]').prop('checked') ? 1 : -1,
                  elementTextValue: ''
                })
                // TODO:此处后面需看还有没有更多情况
                if(sub.hasChild > 0 && sub.isWrite > 0){
                  result.push({
                    basisAnswer: sub.childList[0].answers && sub.childList[0].answers.length ? sub.childList[0].answers[0].basisAnswerId : '',
                    basisElementId: sub.childList[0].basisElementCopyId,
                    elementTextValue: $('[name="' + sub.childList[0].basisElementCopyId + '"]').val(),
                    elementNumValue: ''
                  })
                }
              })
            }
          }
        }
      })
      return result
    },
    save (){
      var result = this.generateAnswers()
      console.log(result)
      var params = new URLSearchParams();
      const allergy=[]
       for(var key in this.optionDataSource){
          _.each(this.optionDataSource[key], function(item){
            allergy.push({
              basisElementId:key,
              microbeName:item.microbeName,
              antibiotic:item.antibiotic,
              antibioticResult:item.antibioticResult,
              allergyValue:item.allergyValue
            })
          })
      }
      params.append('basisAnswer', JSON.stringify(result))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.basisMaskId)
      params.append('allergy', JSON.stringify(allergy))
      submit(params)
      .then(res => {
        console.log(res)
        alert('保存成功')
        // location.href = location.href
      })
      .catch(error => {
        console.log(error)
      })
    },
    submit (){
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
      return false
    },
    initList (list){
      var that = this
      _.each(list, function(a){
        if(a.simple > 0 && a.answers && a.answers.length){
          a.basisElementId = a.answers[0].elementNumValue
        }
        if(typeof a.computeElement !== 'undefined' && a.computeElement === 0 && a.answers && a.answers.length) {
          that.computeMap[a.basisElementCopyId] = a.answers[0].elementTextValue
        }
        if(a.hasChild > 0 && a.isRadio === 0){
          _.each(a.childList,function(b){
            if(typeof b.computeElement !== 'undefined' && b.computeElement === 0 && b.answers && b.answers.length) {
              that.computeMap[b.basisElementCopyId] = b.answers[0].elementTextValue
            }
            if(b.simple > 0 && b.answers && b.answers.length){
              b.basisElementId = b.answers[0].elementNumValue
            }
            //单选
            if(b.hasChild > 0 && b.isRadio > 0){
              var re = _.filter(b.childList, function(v){return v.answers && v.answers.length && v.answers[0].elementNumValue > 0})
              if(re.length) b.basisElementId = re[0].basisElementId
            }
            //多选
            if(b.hasChild > 0 && b.isRadio < 0){
              if(b.childList[0].answers && b.childList[0].answers.length){
                b.elementId = _.map(_.filter(_.flatten(_.map(b.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
              }else{
                b.elementId = []
              }
              //多选框控制子选项
              _.each(b.childList,function(c){
                if(c.logicValue > 0 && c.answers && c.answers.length && c.answers[0].elementNumValue > 0){
                  var selected = _.filter(_.flatten(_.map(c.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0})
                  if(selected.length){
                    c.basisElementId = _.map(selected,function(v){return v.basisElementId})[0]
                  }
                }
              })
            }
            //子选项,第三层
            if(b.hasChild > 0 && b.isRadio === 0){
              _.each(b.childList, function(c){
                if(c.simple > 0 && c.answers && c.answers.length){
                  c.basisElementId = c.answers[0].elementNumValue
                }
                if(c.hasChild > 0 && c.isRadio === 0){
                  _.each(c.childList, function(d){
                    if(d.simple > 0 && d.answers && d.answers.length){
                      d.basisElementId = d.answers[0].elementNumValue
                    }
                    if(d.hasChild > 0 && d.isRadio < 0){
                      if(d.childList[0].answers && d.childList[0].answers.length){
                        d.elementId = _.map(_.filter(_.flatten(_.map(d.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                      }else{
                        d.elementId = []
                      }
                    }else if(d.hasChild > 0 && d.isRadio > 0){
                      if(d.childList[0].answers && d.childList[0].answers.length){
                        var selected = _.filter(_.flatten(_.map(d.childList,function(v){ return v.answers })),function(v){ return v.elementNumValue > 0 })
                        if(selected.length){
                          d.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio < 0){
                  if(c.childList[0].answers && c.childList[0].answers.length){
                    c.elementId = _.map(_.filter(_.flatten(_.map(c.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                  }else{
                    c.elementId = []
                  }
                  _.each(c.childList, function(d){
                    if(d.hasChild > 0 && d.isRadio > 0){
                      if(d.childList[0].answers && d.childList[0].answers.length){
                        var selected = _.filter(_.flatten(_.map(d.childList,function(v){ return v.answers })),function(v){ return v.elementNumValue > 0 })
                        if(selected.length){
                          d.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio > 0){
                  if(c.childList[0].answers && c.childList[0].answers.length){
                    var selected = _.filter(_.flatten(_.map(c.childList,function(v){ return v.answers })),function(v){ return v.elementNumValue > 0 })
                    if(selected.length){
                      c.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                    }
                  }
                }
              })
            }
          })
        }else if(a.hasChild > 0 && a.isRadio < 0){
          if(a.childList[0].answers && a.childList[0].answers.length){
            a.elementId = _.map(_.filter(_.flatten(_.map(a.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
          }else{
            a.elementId = []
          }
        }else if(a.hasChild > 0 && a.isRadio > 0){
          var re = _.filter(a.childList, function(v){return v.answers && v.answers.length && v.answers[0].elementNumValue > 0})
          if(re.length) a.basisElementId = re[0].basisElementId
        }
      })
      return list
    },
    compute (id){
      console.log(id)
      var that = this
      var result = this.generateAnswers()
      var params = new URLSearchParams();
      params.append('basisElementId', id)
      params.append('basisAnswer', JSON.stringify(result))
      computeScore(params)
        .then(res => {
          console.log(res)
          console.log('计算成功,结果为:' + res.data[id])
          if(typeof res.data[id] !== 'undefined') {
            that.computeMap[id] = res.data[id]
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.clear{
  clear: both;
}
.ant-col-4 .ant-calendar-picker,
.ant-col-6 .ant-calendar-picker{
  width: 100%;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper{
  margin-left: 0;
}
// /deep/ .ant-form label,
// .ant-col-7,
// .ant-col-8,
// .ant-col-6,
// .ant-col-5,
// .ant-col-4{
//   font-size: 16px;
// }
/deep/ .ant-row{
  clear: both;
}
.page-header-index-wide{
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 18px 32px;
  }
  /deep/ .tree-title{
    border-right: 1px solid #E8E8E8;
    color: #25AEFE;
    font-size: 22px;
    padding-left: 55px;
    padding-top: 5px;
    padding-bottom: 10px;
    background-image:url(../../../assets/treeTop.png) ;
    background-repeat: no-repeat;
  }
  /deep/ .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title,.ant-menu .ant-menu-item{
    height: 50px;
    line-height: 50px;
  }
  /deep/ .ant-menu-submenu-title{
    height: 50px;
    line-height: 50px;
  }
  /deep/ .ant-menu-item{
    .ant-menu-item:hover, .ant-menu-item-active, .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open, .ant-menu-submenu-active, .ant-menu-submenu-title:hover {
        background-color: #EAF2FD;
    }
    .placeholderI{
      display: inline-block;
      width: 27px;
    }
    .anticon.anticon-check-circle{
        font-size: 18px;
        color: #8AC51B;
    }
    .anticon.anticon-clock-circle{
      font-size: 18px;
      color: #06A0E2;
    }
    .treeSubTitle{
      font-size: 16px;
      margin-left: 10px;
      display: inline-block;
      width: 140px;
    }
    .treeSubPercentage{
      font-size: 16px;
      margin-left: 10px;
    }
  }
  /deep/ .ant-menu-submenu{
    &.ant-menu-submenu-inline{
      .treeSubTitle{
         font-size: 16px;
         margin-left: 10px;
         display: inline-block;
         width: 140px;
      }
      .treeSubPercentage{
        font-size: 16px;
        margin-left: 10px;
      }
      .action{
        font-size: 18px;
        &.anticon-check-circle{
          color: #8AC51B;
        }
        &.anticon-clock-circle{
          color: #06A0E2;
        }
      }
      .placeholderI{
        display: inline-block;
        width: 27px;
      }
    }
  }
  .baselineForm{
    .fr{
      float: right;
    }
    .btn{
      margin-right: 10px;
    }
    padding: 20px;
    .ant-row{
      padding-bottom: 10px;
      padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #eee;
      &.no-border{
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    /deep/ .ant-form-item-label{
      text-align: left;
      label:after{
        content: ''
      }
      &.ant-col-md-24 label{
        display: block;
        background-color: #F7F8F8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
      }
    }
    .formSubtitle{
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        font-size: 16px;
        padding-left: 10px;
        margin-bottom: 0px;
        background: #FAFCFD;
        border-bottom: 1px solid #F3F3F3;
    }
  }
}
</style>
