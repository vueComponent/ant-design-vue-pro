<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
     <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
           <a-row :gutter="30" style="line-height: 34px;">
       <a-col :md="1" :sm="4"><a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" /></a-col>
       <a-col :md="4" :sm="20" class="UserNameCard">
         <my-icon type="iconshoufangzhe_huaban" />
         受访者:{{ patient.name }}
       </a-col>
       <a-col :md="6" :sm="24" class="UserNameCard">   
       <my-icon type="iconshenfenzheng_huaban" />
         {{ patient.card }}
       </a-col>
       <a-col :md="13" :sm="24" style="fontSize: 18px;textAlign: right;">创建时间：{{ patient.createDate | moment }}</a-col>
     </a-row>
    </a-card>
    <a-card :bordered="false" :bodyStyle="bodyStyle" style="margin-top: 10px;padding-left: 0">
     <a-row :gutter="8">
       <a-col :span="5" :style="baselineInfoStyle">
        <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
        </s-tree>
       </a-col>
       <a-col :span="19">
         <div style="overflow: hidden;">
           <a-button class="btn fr" @click="save">保存</a-button>
         </div>
         <div class="baselineForm" :style="baselineFormStyle">
              <a-form :form="form">
                <!-- 基线或访视 -->
                <a-form-item v-for="(qu1, index) in list" :key="index" :label="[qu1.sort + '.' + qu1.questionName]" :labelCol="qu1.type === 0 ? labelColVer : labelColHor" :wrapperCol="qu1.type === 0 ? wrapperVer : wrapperHor">
                    <a-radio-group v-if="qu1.simple === 1" :name="qu1.basisElementCopyId+''" v-model="qu1.basisElementId">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="-1">否</a-radio>
                    </a-radio-group>
                    <a-radio-group v-if="qu1.simple === 2" :name="qu1.basisElementCopyId+''" :defaultValue="qu1.reportResultList && qu1.reportResultList.length && qu1.reportResultList[0].elementNumValue">
                      <a-radio :value="1">有</a-radio>
                      <a-radio :value="-1">无</a-radio>
                    </a-radio-group>
                    <!-- <br v-if="qu1.simple > 0"> -->
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'compute'" :defaultValue="qu1.reportResultList && qu1.reportResultList.length && qu1.reportResultList[0].elementTextValue" style="width: 240px" :addonAfter="qu1.unit" @blur="compute(qu1.computeElement)" />
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && !qu1.event && typeof qu1.computeElement !== 'undefined' && qu1.computeElement === 0" :defaultValue="qu1.reportResultList && qu1.reportResultList.length && qu1.reportResultList[0].elementTextValue" style="width: 240px" :addonAfter="qu1.unit"  v-model="computeMap[qu1.basisElementCopyId]" />
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && !qu1.event && typeof qu1.computeElement === 'undefined'" :defaultValue="qu1.reportResultList && qu1.reportResultList.length && qu1.reportResultList[0].elementTextValue" style="width: 240px" :addonAfter="qu1.unit" />
                    <a-date-picker :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate' && (!qu1.reportResultList || qu1.reportResultList.length === 0 || qu1.reportResultList[0].elementTextValue === '')" />
                    <a-date-picker :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate' && (qu1.reportResultList && qu1.reportResultList.length && qu1.reportResultList[0].elementTextValue)" :defaultValue="moment(qu1.reportResultList[0].elementTextValue)" />
                    <a-checkbox-group v-if="qu1.hasChild > 0 && qu1.isRadio < 0 && (qu1.logicValue <= 0 || (qu1.logicValue > 0 && qu1.basisElementId === 1))" v-model="qu1.elementId">
                      <a-checkbox  v-if="op.event!=='showList'" v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementCopyId" :name="qu1.basisElementCopyId+''">{{op.questionName}}</a-checkbox>
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
                        <a-row v-for="(third, index) in sub.childList" v-if="sub.isRadio === 0 && (sub.logicValue <= 0 || (sub.logicValue > 0 && qu1.basisElementId === sub.basisElementCopyId))">
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
                              <a-input :name="third.childList[0].basisElementCopyId+''" :addonAfter="third.childList[0].unit" style="width:240px" :defaultValue="third.childList[0].reportResultList && third.childList[0].reportResultList.length && third.childList[0].reportResultList[0].elementTextValue"></a-input>
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
                              <a-col :span="12" v-if="fourth.logicValue <= 0 || (fourth.logicValue > 0 && fourth.basisElementId === 1) && fourth.hasChild > 0 && fourth.childList[0].isWrite > 0">
                                <a-col :span="6">{{fourth.childList[0].questionName}}</a-col>
                                <a-col :span="12">
                                  <a-input :addonAfter="fourth.childList[0].unit" :name="fourth.childList[0].basisElementCopyId+''" style="width:240px" :defaultValue="fourth.childList[0].reportResultList && fourth.childList[0].reportResultList.length && fourth.childList[0].reportResultList[0].elementTextValue"></a-input>
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
                      <a-col :span="4"><a-input :name="sub.childList[0].basisElementCopyId+''" :addonAfter="sub.childList[0].unit" :defaultValue="sub.childList[0].reportResultList && sub.childList[0].reportResultList.length && sub.childList[0].reportResultList[0].elementTextValue" style="width:240px" /></a-col>
                    </a-row>
                    <!-- 有第二层 -->
                    <div v-if="qu1.hasChild > 0 && qu1.isRadio === 0">
                      <a-row class="itemRow" v-for="(sub, index) in qu1.childList" :key="index" :class="{'no-border': index === qu1.childList.length - 1}" v-if="qu1.logicValue <= 0 || (qu1.logicValue > 0 && qu1.basisElementId === 1)">
                        <!-- 第二层开始 -->
                        <a-col :span="sub.questionName.length > 16 ? 24 : 6">({{sub.sort}}) {{sub.questionName}}</a-col>
                        <!-- 为了体格检查中的啰音的排版 -->
                        <!-- <br v-if="sub.showType === 2 && sub.hasChild > 0 && sub.isRadio === 0 && sub.simple < 0 && sub.isWrite < 0"> -->
                        <a-col :span="18" :class="{'ant-col-push-6': sub.questionName.length > 16}">
                          <!-- 是否，有无以及填写值 -->
                          <a-col :span="6" v-if="sub.isWrite > 0">
                            <a-input v-if="sub.isWrite > 0 && !sub.event && typeof sub.computeElement !== 'undefined' && sub.computeElement === 0" :name="sub.basisElementCopyId+''" :defaultValue="sub.reportResultList && sub.reportResultList.length && sub.reportResultList[0].elementTextValue" :addonAfter="sub.unit" :readOnly="sub.computeElement === 0" v-model="computeMap[sub.basisElementCopyId]" style="width:240px" />
                            <a-input v-if="sub.isWrite > 0 && !sub.event && typeof sub.computeElement === 'undefined'" :name="sub.basisElementCopyId+''" :defaultValue="sub.reportResultList && sub.reportResultList.length && sub.reportResultList[0].elementTextValue || ''" :addonAfter="sub.unit" style="width:240px" />
                            <a-input v-if="sub.isWrite > 0 && sub.event === 'compute'" :name="sub.basisElementCopyId+''" :defaultValue="sub.reportResultList && sub.reportResultList.length && sub.reportResultList[0].elementTextValue || ''" :addonAfter="sub.unit" @blur="compute(sub.computeElement)" style="width:240px" />
                            <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate' && (!sub.reportResultList || sub.reportResultList.length === 0 || sub.reportResultList[0].elementTextValue === '')" :name="sub.basisElementCopyId+''" style="width:240px" />
                            <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate' && sub.reportResultList && sub.reportResultList.length && sub.reportResultList[0].elementTextValue" :name="sub.basisElementCopyId+''" :defaultValue="moment(sub.reportResultList[0].elementTextValue)" style="width:240px" />
                          </a-col>
                          <br v-if="sub.isWrite > 0">
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
                          <a-col :span="6" v-if="(sub.logicValue <= 0 || sub.basisElementId === 1) && sub.childEleName">{{sub.childEleName}}</a-col>
                          <a-checkbox-group v-if="sub.hasChild > 0 && sub.isRadio < 0 &&(sub.logicValue <= 0 || sub.basisElementId === 1) && sub.childList[0].event !== 'showList'" v-model="sub.elementId">
                            <a-checkbox v-for="(subOp,index) in sub.childList" :key="index" :name="subOp.parentId+''" :value="subOp.basisElementCopyId">{{subOp.questionName}}</a-checkbox>
                          </a-checkbox-group>
                          <a-checkbox-group v-if="sub.hasChild > 0 && sub.isRadio < 0 && (sub.logicValue <= 0 || sub.basisElementId === 1) && sub.childList[0].event === 'showList'" v-model="sub.elementId" style="width: 80%;">
                           <span v-for="(subOp, index) in sub.childList">
                             <a-checkbox v-if="subOp.event=='showList'" :name="subOp.parentId+''"    @change="showList($event,subOp.event,subOp.questionName)" :key="index" :value="subOp.basisElementCopyId">{{subOp.questionName}}</a-checkbox>
                             <div  v-if="subOp.event=='showList' && sub.elementId.indexOf(subOp.basisElementCopyId) > -1&&subOp.questionName=='其他' "  style="display: inline-block;width: 300px;argin-right: 10px;">
                                <a-input :name="subOp.childList[0].basisElementCopyId+''" :defaultValue="subOp.childList[0].reportResultList && subOp.childList[0].reportResultList.length&&subOp.childList[0].reportResultList[0].elementTextValue || ''" @blur="blurInput($event,subOp.childList[0])"  :addonAfter="subOp.childList[0].unit"  />
                             </div>
                             <add-table v-if="subOp.event=='showList' && sub.elementId.indexOf(subOp.basisElementCopyId) > -1&&subOp.questionName!=='其他'"  v-model="optionDataSource[subOp.basisElementCopyId]" :dataSource=" subOp.medicineAllergyList?subOp.medicineAllergyList:optionDataSource[subOp.basisElementCopyId]"></add-table>
                             <add-table  v-if="subOp.event == 'showList' && subOp.questionName == '其他' && sub.elementId.indexOf(subOp.basisElementCopyId) > -1"  v-model="optionDataSource[subOp.childList[0].parentId]" :dataSource="subOp.medicineAllergyList?subOp.medicineAllergyList:optionDataSource[subOp.childList[0].parentId]"></add-table>
                           </span>
                          </a-checkbox-group>
                          <!-- 二级联动 -->
                          <a-row v-for="(third, index) in sub.childList" :key="index" v-if="sub.hasChild > 0 && sub.isRadio < 0 && third.hasChild > 0 && third.logicValue > 0 && sub.elementId.indexOf(third.basisElementCopyId) > -1" class="no-border">
                            <a-col :span="6" v-if="third.childList[0].isWrite > 0">{{third.childList[0].questionName}}</a-col>
                            <a-col :span="8" v-if="third.childList[0].isWrite > 0">
                              <a-date-picker v-if="third.childList[0].event === 'showDate' && third.childList[0].reportResultList && third.childList[0].reportResultList.length && third.childList[0].reportResultList[0].elementTextValue" :defaultValue="moment(third.childList[0].reportResultList[0].elementTextValue)" :name="third.childList[0].basisElementCopyId+''" style="width:240px" />
                              <a-date-picker v-if="third.childList[0].event === 'showDate' && (!third.childList[0].reportResultList || !third.childList[0].reportResultList.length || !third.childList[0].reportResultList[0].elementTextValue)" :name="third.childList[0].basisElementCopyId+''" style="width:240px" />
                              <a-input v-if="!third.childList[0].event&&third.event!=='showList'" :addonAfter="third.childList[0].unit" :name="third.childList[0].basisElementCopyId+''" :defaultValue="third.childList[0].reportResultList && third.childList[0].reportResultList.length && third.childList[0].reportResultList[0].elementTextValue || ''" style="width:240px" />
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
                          <div v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue <= 0 && thirdSub.logicValue > 0 && thirdSub.hasChild > 0 && thirdSub.basisElementCopyId === sub.basisElementId" v-for="(thirdSub, index) in sub.childList">
                            <div v-if="thirdSub.isRadio === 0">
                              <a-row v-for="(fourth, index) in thirdSub.childList" :class="{'no-border': index === thirdSub.childList.length - 1}">
                                <!-- total lung capacity -->
                                <a-col :span="6">{{fourth.questionName}}</a-col>
                                <ocr-load v-if="fourth.event=='upload'" :fileList="fileList" :basisMaskId="basisMaskId" :reportCollectBaseId="reportCollectBaseId" ref="ocrloadModel" @OCRload="OCRload" @imgUrl="saveImgUrl"></ocr-load>
                                <a-radio-group v-if="fourth.simple === 2" v-model="fourth.basisElementId" :name="fourth.basisElementCopyId+''">
                                  <a-radio :value="1">有</a-radio>
                                  <a-radio :value="-1">无</a-radio>
                                </a-radio-group>
                                <a-input v-if="fourth.isWrite > 0" :addonAfter="fourth.unit" :name="fourth.basisElementCopyId+''" :defaultValue="fourth.reportResultList && fourth.reportResultList.length && fourth.reportResultList[0].elementTextValue || ''" style="width: 240px"></a-input>
                                <div v-if="fourth.hasChild > 0 && fourth.isRadio === 0">
                                  <a-row class="no-border" v-for="fifth in fourth.childList" v-if="fourth.logicValue <= 0 || fourth.basisElementId === 1">
                                    <a-col :span="6">{{fifth.questionName}}</a-col>
                                    <a-col :span="4" v-if="fifth.simple === 2">
                                      <a-radio-group v-model="fifth.basisElementId" :name="fifth.basisElementCopyId+''">
                                        <a-radio :value="1">有</a-radio>
                                        <a-radio :value="-1">无</a-radio>
                                      </a-radio-group>
                                    </a-col>
                                    <div v-if="fifth.hasChild > 0 && (fifth.logicValue <= 0 || fifth.basisElementId === 1) && fifth.isRadio === 0">
                                      <a-col :span="4">{{fifth.childList[0].questionName}}</a-col>
                                      <a-input v-if="fifth.childList[0].isWrite > 0" :span="8" style="width: 240px" :name="fifth.childList[0].basisElementCopyId+''" :defaultValue="fifth.childList[0].reportResultList && fifth.childList[0].reportResultList.length && fifth.childList[0].reportResultList[0].elementTextValue || ''" :addonAfter="fifth.childList[0].unit"></a-input>
                                    </div>
                                    <a-col :span="4" v-if="fifth.isWrite > 0">
                                      <a-input :name="fifth.basisElementCopyId+''" :addonAfter="fifth.unit" :defaultValue="fifth.reportResultList && fifth.reportResultList.length && fifth.reportResultList[0].elementTextValue || ''" style="width:240px"></a-input>
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
                            <a-col :span="8"><a-input :name="sub.childList[0].basisElementCopyId+''" style="width:240px" :defaultValue="sub.childList[0].reportResultList && sub.childList[0].reportResultList.length && sub.childList[0].reportResultList[0].elementTextValue || ''" /></a-col>
                          </a-col>
                          <a-row class="no-border" v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue > 0 && secondSub.hasChild > 0" v-for="(secondSub, index) in sub.childList" :key="index">
                            <a-col :span="3" v-if="sub.basisElementId === secondSub.basisElementId">{{secondSub.childList[0].questionName}}</a-col>
                            <a-col :span="8" v-if="sub.basisElementId === secondSub.basisElementId"><a-input :addonAfter="secondSub.childList[0].unit" :defaultValue="secondSub.childList[0].reportResultList && secondSub.childList[0].reportResultList.length && secondSub.childList[0].reportResultList[0].elementTextValue || ''" :name="secondSub.childList[0].basisElementCopyId+''" style="width:240px" /></a-col>
                          </a-row>
                          <a-row v-if="sub.hasChild > 0 && sub.isRadio === 0 && (sub.logicValue <= 0 || sub.basisElementId === 1)" v-for="(subOp,index) in sub.childList" :class="{'ant-col-pull-6': subOp.level > 3 || subOp.display > 0, 'no-border': index === sub.childList.length - 1}">
                            <!-- <br> -->
                              <!-- 调脂那一层,如果是紧跟后面的单选框或者输入框就占8格；否则就是子问题，占12格 -->
                              <a-col :span="subOp.simple > 0 || subOp.isRadio > 0 || (subOp.questionName.length <= 16 && subOp.isWrite > 0) ? 6 : 24">{{subOp.questionName}}</a-col>
                              <a-radio-group v-if="subOp.simple === 1" v-model="subOp.basisElementId" :name="subOp.basisElementCopyId+''">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="-1">否</a-radio>
                              </a-radio-group>
                              <a-radio-group v-if="subOp.simple === 2" v-model="subOp.basisElementId" :name="subOp.basisElementCopyId+''">
                                <a-radio :value="1">有</a-radio>
                                <a-radio :value="-1">无</a-radio>
                              </a-radio-group>
                              <a-col :span="6" v-if="subOp.isWrite > 0">
                                <a-date-picker v-if="subOp.event === 'showDate' && subOp.reportResultList && subOp.reportResultList.length && subOp.reportResultList[0].elementTextValue" :name="subOp.basisElementCopyId+''" :defaultValue="moment(subOp.reportResultList[0].elementTextValue)" style="width:240px" />
                                <a-date-picker v-if="subOp.event === 'showDate' && (!subOp.reportResultList || !subOp.reportResultList.length || !subOp.reportResultList[0].elementTextValue)" :name="subOp.basisElementCopyId+''" style="width:240px" />
                                <a-input :name="subOp.basisElementCopyId+''" v-if="!subOp.event || subOp.event !== 'showDate'" :defaultValue="subOp.reportResultList && subOp.reportResultList.length && subOp.reportResultList[0].elementTextValue || ''" :addonAfter="subOp.unit" style="width:240px" />
                              </a-col>
                              <a-col :span="24" v-if="subOp.hasChild > 0 && subOp.isRadio < 0 && (subOp.logicValue <= 0 || subOp.basisElementId === 1)">
                                <a-checkbox-group v-model="subOp.elementId" v-if="subOp.childList[0].event !== 'showList'">
                                  <a-checkbox v-for="(secondSub,index) in subOp.childList" :key="index" :name="secondSub.parentId+''" :value="secondSub.basisElementCopyId">{{secondSub.questionName}}</a-checkbox>
                                </a-checkbox-group>
                                <a-checkbox-group v-if="subOp.hasChild > 0 && subOp.isRadio < 0&& (subOp.logicValue <= 0 || subOp.basisElementId === 1) && subOp.childList[0].event === 'showList'" v-model="subOp.elementId" style="width: 100%;">
                                  <span v-for="(secondSub, index) in subOp.childList" >
                                    <a-checkbox v-if="secondSub.event=='showList'"  :name="secondSub.parentId+''" @change="showList($event,secondSub.event,secondSub.questionName)" :key="index" :value="secondSub.basisElementCopyId">{{secondSub.questionName}}</a-checkbox>
                                    <div  v-if="secondSub.event=='showList' && subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1&&secondSub.questionName=='其他' "  style="display: inline-block;width: 300px;margin-right: 10px;">
                                       <a-input :name="secondSub.childList[0].basisElementCopyId+''"  @blur="blurInput($event,secondSub.childList[0])"  :addonAfter="secondSub.childList[0].unit" :defaultValue="secondSub.childList[0].reportResultList && secondSub.childList[0].reportResultList.length && secondSub.childList[0].reportResultList[0].elementTextValue || ''" />
                                    </div>
                                    <add-table v-if="secondSub.event=='showList' && subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1&&secondSub.questionName!=='其他'"  v-model="optionDataSource[secondSub.basisElementCopyId]" :dataSource="secondSub.medicineAllergyList?secondSub.medicineAllergyList:optionDataSource[secondSub.basisElementCopyId]"></add-table>
                                    <add-table v-if="secondSub.event=='showList' &&secondSub.questionName=='其他'&& subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1"  v-model="optionDataSource[secondSub.childList[0].parentId]" :dataSource="secondSub.medicineAllergyList?secondSub.medicineAllergyList:optionDataSource[secondSub.childList[0].parentId]"></add-table>
                                  </span>
                                 </a-checkbox-group>
                              </a-col>
                              <div v-if="subOp.hasChild > 0 && subOp.isRadio < 0 && (subOp.logicValue <= 0 || subOp.basisElementId === 1) && subOp.elementId.indexOf(secondSub.basisElementCopyId) > -1" v-for="(secondSub, index) in subOp.childList" :key="index">
                                <div v-if="secondSub.hasChild > 0 && secondSub.isRadio === 0">
                                  <a-row v-for="(thirdSub, index) in secondSub.childList" class="no-border">
                                    <a-col :span="6" v-if="thirdSub.questionName">{{thirdSub.questionName}}</a-col>
                                    <a-col :span="8" v-if="thirdSub.isWrite > 0">
                                      <a-input style="width: 240px;" :name="thirdSub.basisElementCopyId+''" :defaultValue="thirdSub.reportResultList && thirdSub.reportResultList.length && thirdSub.reportResultList[0].elementTextValue || ''" v-if="!thirdSub.event && thirdSub.event == 'showList'" :addonAfter="thirdSub.unit"></a-input>
                                      <a-date-picker v-if="thirdSub.event === 'showDate' && thirdSub.reportResultList && thirdSub.reportResultList.length && thirdSub.reportResultList[0].elementTextValue" :name="thirdSub.basisElementCopyId+''" :defaultValue="moment(thirdSub.reportResultList[0].elementTextValue)" style="width:240px" />
                                      <a-date-picker v-if="thirdSub.event === 'showDate' && (!thirdSub.reportResultList || !thirdSub.reportResultList.length || !thirdSub.reportResultList[0].elementTextValue)" :name="thirdSub.basisElementCopyId+''" style="width:240px" />
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
                                <a-input style="width:240px;" :name="secondSub.basisElementCopyId+''" :defaultValue="secondSub.reportResultList && secondSub.reportResultList.length && secondSub.reportResultList[0].elementTextValue"></a-input>
                              </a-col> -->
                              <a-col :span="18" v-if="subOp.hasChild > 0 && subOp.isRadio > 0">
                                <a-radio-group :name="subOp.basisElementCopyId+''" v-model="subOp.basisElementId">
                                  <a-radio v-for="(secondSub,index) in subOp.childList" :key="index" :value="secondSub.basisElementId">{{secondSub.questionName}}</a-radio>
                                </a-radio-group>
                              </a-col>
                              <div v-for="(secondSub, index) in subOp.childList" v-if="subOp.hasChild > 0 && subOp.isRadio > 0 && secondSub.hasChild > 0 && secondSub.isRadio === 0 && (secondSub.logicValue <= 0 || subOp.basisElementId === secondSub.basisElementCopyId)">
                                <a-col v-for="(thirdSub,index) in secondSub.childList">
                                  <a-col :span="6">{{thirdSub.questionName}}</a-col>
                                  <a-col :span="6" v-if="thirdSub.isWrite > 0">
                                    <a-input :name="thirdSub.basisElementCopyId+''" :defaultValue="thirdSub.reportResultList && thirdSub.reportResultList.length && thirdSub.reportResultList[0].elementTextValue || ''" style="width:240px" :addonAfter="thirdSub.unit"></a-input>
                                  </a-col>
                                </a-col>
                              </div>
                              <a-row v-if="subOp.hasChild > 0 && subOp.isRadio === 0  && (!subOp.logicValue || subOp.basisElementId === 1)" v-for="(thirdSub, index) in subOp.childList" :key="index" class="no-border">
                                <!-- 雾化治疗 -->
                                <a-col :span="6">{{thirdSub.questionName}}</a-col>
                                <a-col :span="16">
                                  <a-radio-group v-if="thirdSub.simple === 1" :name="thirdSub.basisElementCopyId+''" v-model="thirdSub.basisElementId">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="-1">否</a-radio>
                                  </a-radio-group>
                                  <a-date-picker v-if="thirdSub.event === 'showDate' && thirdSub.reportResultList && thirdSub.reportResultList.length && thirdSub.reportResultList[0].elementTextValue" :defaultValue="moment(thirdSub.reportResultList[0].elementTextValue)" :name="thirdSub.basisElementCopyId+''" style="width:240px" />
                                  <a-date-picker v-if="thirdSub.event === 'showDate' && (!thirdSub.reportResultList || !thirdSub.reportResultList.length || !thirdSub.reportResultList[0].elementTextValue)" :name="thirdSub.basisElementCopyId+''" style="width:240px" />
                                  <a-input v-if="thirdSub.isWrite > 0 && !thirdSub.event" :name="thirdSub.basisElementCopyId + ''" :defaultValue="thirdSub.reportResultList && thirdSub.reportResultList.length && thirdSub.reportResultList[0].elementTextValue || ''" style="width:240px" :addonAfter="thirdSub.unit" />
                                    <!-- 注掉br是因为啰音类型会掉下去，别处需要换行再调整 -->
                                  <!-- <br v-if="thirdSub.hasChild > 0 && thirdSub.isRadio > 0 && thirdSub.simple > 0"> -->
                                  <a-radio-group v-if="thirdSub.hasChild > 0 && thirdSub.isRadio > 0 && (thirdSub.logicValue <= 0 || thirdSub.basisElementId === 1)" :name="thirdSub.basisElementCopyId+''" v-model="thirdSub.basisElementId" style="width: 100%">
                                    <a-radio v-for="(fourth, index) in thirdSub.childList" :key="index" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-radio>
                                  </a-radio-group>
                                  <div v-if="thirdSub.hasChild > 0 && thirdSub.isRadio > 0 && (thirdSub.logicValue <= 0 || thirdSub.basisElementId === 1)">
                                    <div v-for="(fourth, index) in thirdSub.childList" :key="index" v-if="fourth.hasChild > 0 && fourth.isRadio === 0 && (fourth.logicValue <= 0 || thirdSub.basisElementId === fourth.basisElementCopyId)">
                                      <a-row class="no-border">
                                        <a-col :span="6">{{fourth.childList[0].questionName}}</a-col>
                                        <a-col :span="16" v-if="fourth.childList[0].isWrite > 0">
                                          <a-input :name="fourth.childList[0].basisElementCopyId+''" style="width: 240px;" :defaultValue="fourth.childList[0].reportResultList && fourth.childList[0].reportResultList.length && fourth.childList[0].reportResultList[0].elementTextValue || ''" :addonAfter="fourth.childList[0].unit"></a-input>
                                        </a-col>
                                      </a-row>
                                    </div>
                                  </div>
                                  <a-checkbox-group v-if="thirdSub.isRadio < 0 && thirdSub.hasChild > 0" v-model="thirdSub.elementId">
                                    <a-checkbox v-for="(fourth,index) in thirdSub.childList" :key="index" :name="fourth.parentId+''" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-checkbox>
                                  </a-checkbox-group>
                                  <div v-if="thirdSub.hasChild > 0 && thirdSub.isRadio === 0 && (thirdSub.logicValue <= 0 || thirdSub.basisElementId === 1)">
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
import { submit,getMedicineAllergyList,computeScore, getCollectDetail, getCollectElements, saveReport } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import AddTable from "./model/table"
import ocrLoad from "./model/upload"
import { MyIcon } from '@/components/_util/util';
export default {
  name: 'success',
  components: {
    STree,
    AddTable,
    MyIcon,
    ocrLoad
  },
  data() {
    return {
      baselineInfoStyle:{
        overflow:"auto",
        height:(window.screen.height-330)+'px',
        "padding-right":"0px",
        "border-right":"1px solid #ddd"
      },
      baselineFormStyle:{
        height:(window.screen.height-350)+'px',
      },
      optionDataSource:[],
      checkedList:[],
      title: '报告采集',
      openKeys: [],
      defaultSelectedKeys: [],
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
      list: [],
      listArr: [],
      list1: [],
      question:{},
      basisMaskId: undefined,
      validateFlag: false,
      reportCollectBaseId: this.$route.params.id,
      computeMap: {
        1208: '',
        2727: '', 
        1160: '',
        4207: ''
      },
      disBlock :{
        display: 'block',
      },
      bodyStyle: {
        'padding-left': '0px'
      },
      imgUrl:"",
      fileList:[]
    }
  },
  beforeCreate (){
    this.form = this.$form.createForm(this, {onFieldsChange: this.onFieldsChange, onValuesChange: this.onValuesChange})
  },
  activated() {
    this.list = []
  },
  created() {
     this.list=[]
    var that = this
    this.CloseSidebar()
    // this.compute = _.debounce(this.compute, 300) //节流阀
    var params = new URLSearchParams()
    params.append('reportCollectBaseId', this.reportCollectBaseId)
    getCollectDetail(params)
    .then(res => {
      that.patient = res.data.patient
      that.orgTree = res.data.bmList
      if(typeof this.$route.query.markId === 'undefined'){
        that.basisMaskId = that.orgTree[0].basisMarkId
        that.getElementsAnswer()
        that.defaultSelectedKeys = [that.basisMaskId]
      }
    })
    if(this.$route.query.markId){
      this.basisMaskId = parseInt(this.$route.query.markId)
      this.getElementsAnswer()
      this.defaultSelectedKeys = [this.basisMaskId]
    }
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
    OCRload(data){
      console.log(data);
      this.$nextTick(function(){
         this.list = this.initList(data.basisElementList)
      })
    },
     saveImgUrl(data){
      this.imgUrl=data;
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
    getElementsAnswer (){
      var that = this;
      var params = new URLSearchParams();
      params.append('basisMarkId', this.basisMaskId)
      params.append('reportCollectBaseId', this.reportCollectBaseId)
      getCollectElements(params)
      .then(res => {
        that.imgUrl=res.url;
        that.fileList=[{
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: res.url,
        }]
        that.list = that.initList(res.basisElementList)
      })
    },
    generateAnswers (){
      var result = []
      _.each(this.list, function(item){
        if(item.simple > 0){
          result.push({
            reportResultId: (item.reportResultList && item.reportResultList.length) ? item.reportResultList[0].reportResultId : '',
            basisElementId: item.basisElementCopyId,
            elementNumValue: typeof $('input[name="' + item.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + item.basisElementCopyId + '"]:checked').val() : '',
            elementTextValue: ''
          })
        }else if(item.isWrite > 0){
          var text = $('[name="' + item.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + item.basisElementCopyId + '"] input').val() : $('[name="' + item.basisElementCopyId + '"]').val()
          result.push({
            reportResultId: (item.reportResultList && item.reportResultList.length) ? item.reportResultList[0].reportResultId : '',
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
                  reportResultId: (sub.reportResultList && sub.reportResultList.length) ? sub.reportResultList[0].reportResultId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementTextValue: text,
                  elementNumValue: ''
                })
              }
              if(sub.simple > 0){
                result.push({
                  reportResultId: (sub.reportResultList && sub.reportResultList.length) ? sub.reportResultList[0].reportResultId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: typeof $('input[name="' + sub.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + sub.basisElementCopyId + '"]:checked').val() : '',
                  elementTextValue: ''
                })
              }
              
              if(sub.hasChild > 0){
                if(sub.isRadio !== 0){
                  _.each(sub.childList, function(third){
                    result.push({
                      reportResultId: third.reportResultList && third.reportResultList.length ? third.reportResultList[0].reportResultId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: $('[value="' + third.basisElementCopyId + '"][name="' + third.parentId + '"]').prop('checked') ? 1 : -1,
                      elementTextValue: ''
                    })
                  })
                }
                _.each(sub.childList, function(third){
                  if(third.simple > 0){
                    result.push({
                      reportResultId: (third.reportResultList && third.reportResultList.length) ? third.reportResultList[0].reportResultId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: typeof $('input[name="' + third.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + third.basisElementCopyId + '"]:checked').val() : '',
                      elementTextValue: ''
                    })
                  }
                  if(third.isWrite > 0){
                    var text = $('[name="' + third.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + third.basisElementCopyId + '"] input').val() : $('[name="' + third.basisElementCopyId + '"]').val()
                    result.push({
                      reportResultId: (third.reportResultList && third.reportResultList.length) ? third.reportResultList[0].reportResultId : '',
                      basisElementId: third.basisElementCopyId,
                      elementTextValue: text || '',
                      elementNumValue: ''
                    })
                  }
                  if(third.hasChild > 0){
                    
                    _.each(third.childList,function(fourth){
                      if(third.isRadio !== 0){
                        result.push({
                          reportResultId: fourth.reportResultList && fourth.reportResultList.length ? fourth.reportResultList[0].reportResultId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: $('[value="' + fourth.basisElementCopyId + '"][name="' + fourth.parentId + '"]').prop('checked') ? 1 : -1,
                          elementTextValue: ''
                        })
                      }
                      if(fourth.simple > 0){
                        result.push({
                          reportResultId: (fourth.reportResultList && fourth.reportResultList.length) ? fourth.reportResultList[0].reportResultId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: typeof $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + fourth.basisElementCopyId + '"]:checked').val() : '',
                          elementTextValue: ''
                        })
                      }
                      if(fourth.isWrite > 0){
                        var text = $('[name="' + fourth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fourth.basisElementCopyId + '"] input').val() : $('[name="' + fourth.basisElementCopyId + '"]').val()
                        result.push({
                          reportResultId: (fourth.reportResultList && fourth.reportResultList.length) ? fourth.reportResultList[0].reportResultId : '',
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
                              reportResultId: (fifth.reportResultList && fifth.reportResultList.length) ? fifth.reportResultList[0].reportResultId : '',
                              basisElementId: fifth.basisElementCopyId,
                              elementTextValue: text || '',
                              elementNumValue: ''
                            })
                          }
                          if(fifth.simple > 0){
                            result.push({
                              reportResultId: (fifth.reportResultList && fifth.reportResultList.length) ? fifth.reportResultList[0].reportResultId : '',
                              basisElementId: fifth.basisElementCopyId,
                              elementNumValue: typeof $('input[name="' + fifth.basisElementCopyId + '"]:checked').val() !== 'undefined' ? $('input[name="' + fifth.basisElementCopyId + '"]:checked').val() : '',
                              elementTextValue: ''
                            })
                          }
                          if(fifth.hasChild > 0 && fifth.isRadio === 0){
                            _.each(fifth.childList, function(sixth){
                              if(sixth.isWrite > 0){
                                var text = $('[name="' + sixth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sixth.basisElementCopyId + '"] input').val() : $('[name="' + sixth.basisElementCopyId + '"]').val()
                                result.push({
                                  reportResultId: (sixth.reportResultList && sixth.reportResultList.length) ? sixth.reportResultList[0].reportResultId : '',
                                  basisElementId: sixth.basisElementCopyId,
                                  elementTextValue: text || '',
                                  elementNumValue: ''
                                })
                              }
                            })
                          }
                        })
                      }else if(fourth.hasChild > 0 && fourth.isRadio !== 0){
                        _.each(fourth.childList, function(fifth){
                          result.push({
                            reportResultId: fifth.reportResultList && fifth.reportResultList.length ? fifth.reportResultList[0].reportResultId : '',
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
                  reportResultId: sub.reportResultList && sub.reportResultList.length ? sub.reportResultList[0].reportResultId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: $('[value="' + sub.basisElementCopyId + '"][name="' + sub.parentId + '"]').prop('checked') ? 1 : -1,
                  elementTextValue: ''
                })
                // TODO:此处后面需看还有没有更多情况
                if(sub.hasChild > 0 && sub.isWrite > 0){
                  result.push({
                    basisAnswer: sub.childList[0].reportResultList && sub.childList[0].reportResultList.length ? sub.childList[0].reportResultList[0].reportResultId : '',
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
      var that = this
      var result = this.generateAnswers()
      console.log(result)
      var params = new URLSearchParams();
      params.append('reportResult', JSON.stringify(result))
      params.append('reportCollectBaseId', this.reportCollectBaseId)
      params.append('basisMarkId', this.basisMaskId)
      params.append('url', this.imgUrl)
      saveReport(params)
      .then(res => {
        console.log(res)
        that.$message.success(res.msg, function(){
          var href = location.href.replace(/\?markId=[\d]+/,'')
          location.href = href + '?markId=' + that.basisMaskId
        })
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
        if(a.simple > 0 && a.reportResultList && a.reportResultList.length){
          a.basisElementId = a.reportResultList[0].elementNumValue
        }
        if(typeof a.computeElement !== 'undefined' && a.computeElement === 0 && a.reportResultList && a.reportResultList.length) {
          that.computeMap[a.basisElementCopyId] = a.reportResultList[0].elementTextValue
        }
        if(a.hasChild > 0 && a.isRadio === 0){
          _.each(a.childList,function(b){
            if(typeof b.computeElement !== 'undefined' && b.computeElement === 0 && b.reportResultList && b.reportResultList.length) {
              that.computeMap[b.basisElementCopyId] = b.reportResultList[0].elementTextValue
            }
            if(b.simple > 0 && b.reportResultList && b.reportResultList.length){
              b.basisElementId = b.reportResultList[0].elementNumValue
            }
            //单选
            if(b.hasChild > 0 && b.isRadio > 0){
              var re = _.filter(b.childList, function(v){return v.reportResultList && v.reportResultList.length && v.reportResultList[0].elementNumValue > 0})
              if(re.length) b.basisElementId = re[0].basisElementId
              _.each(b.childList, function(c){
                if(c.logicValue > 0 && c.hasChild > 0 && c.isRadio === 0){
                  _.each(c.childList, function(d){
                    if(d.simple > 0 && d.reportResultList && d.reportResultList.length){
                      d.basisElementId = d.reportResultList[0].elementNumValue
                    }
                    if(d.hasChild > 0 && d.isRadio === 0){
                      _.each(d.childList, function(e){
                        if(e.simple > 0 && e.reportResultList && e.reportResultList.length){
                          e.basisElementId = e.reportResultList[0].elementNumValue
                        }
                      })
                    }
                  })
                }
                if(c.logicValue > 0 && c.hasChild > 0 && c.isRadio > 0){

                }
              })
            }
            //多选
            if(b.hasChild > 0 && b.isRadio < 0){
              if(b.childList[0].reportResultList && b.childList[0].reportResultList.length){
                b.elementId = _.map(_.filter(_.flatten(_.map(b.childList,function(v){return v.reportResultList})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
              }else{
                b.elementId = []
              }
              //多选框控制子选项
              _.each(b.childList,function(c){
                if(c.logicValue > 0 && c.reportResultList && c.reportResultList.length && c.reportResultList[0].elementNumValue > 0){
                  var selected = _.filter(_.flatten(_.map(c.childList,function(v){return v.reportResultList})),function(v){return v.elementNumValue > 0})
                  if(selected.length){
                    c.basisElementId = _.map(selected,function(v){return v.basisElementId})[0]
                  }
                }
              })
            }
            //子选项,第三层
            if(b.hasChild > 0 && b.isRadio === 0){
              _.each(b.childList, function(c){
                if(c.simple > 0 && c.reportResultList && c.reportResultList.length){
                  c.basisElementId = c.reportResultList[0].elementNumValue
                }
                if(c.hasChild > 0 && c.isRadio === 0){
                  _.each(c.childList, function(d){
                    if(d.simple > 0 && d.reportResultList && d.reportResultList.length){
                      d.basisElementId = d.reportResultList[0].elementNumValue
                    }
                    if(d.hasChild > 0 && d.isRadio < 0){
                      if(d.childList[0].reportResultList && d.childList[0].reportResultList.length){
                        d.elementId = _.map(_.filter(_.flatten(_.map(d.childList,function(v){return v.reportResultList})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                      }else{
                        d.elementId = []
                      }
                    }else if(d.hasChild > 0 && d.isRadio > 0){
                      if(d.childList[0].reportResultList && d.childList[0].reportResultList.length){
                        var selected = _.filter(_.flatten(_.map(d.childList,function(v){ return v.reportResultList })),function(v){ return v.elementNumValue > 0 })
                        if(selected.length){
                          d.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio < 0){
                  if(c.childList[0].reportResultList && c.childList[0].reportResultList.length){
                    c.elementId = _.map(_.filter(_.flatten(_.map(c.childList,function(v){return v.reportResultList})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                  }else{
                    c.elementId = []
                  }
                  _.each(c.childList, function(d){
                    if(d.hasChild > 0 && d.isRadio > 0){
                      if(d.childList[0].reportResultList && d.childList[0].reportResultList.length){
                        var selected = _.filter(_.flatten(_.map(d.childList,function(v){ return v.reportResultList })),function(v){ return v.elementNumValue > 0 })
                        if(selected.length){
                          d.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                        }
                      }
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio > 0){
                  if(c.childList[0].reportResultList && c.childList[0].reportResultList.length){
                    var selected = _.filter(_.flatten(_.map(c.childList,function(v){ return v.reportResultList })),function(v){ return v.elementNumValue > 0 })
                    if(selected.length){
                      c.basisElementId = _.map(selected,function(v){ return v.basisElementId })[0]
                    }
                  }
                }
              })
            }
          })
        }else if(a.hasChild > 0 && a.isRadio < 0){
          if(a.childList[0].reportResultList && a.childList[0].reportResultList.length){
            a.elementId = _.map(_.filter(_.flatten(_.map(a.childList,function(v){return v.reportResultList})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
          }else{
            a.elementId = []
          }
        }else if(a.hasChild > 0 && a.isRadio > 0){
          var re = _.filter(a.childList, function(v){return v.reportResultList && v.reportResultList.length && v.reportResultList[0].elementNumValue > 0})
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
 /deep/ #baselineHeader{
    .ant-card-body{
      padding: 10px
    }
  }
  
  .ml-10{
    margin-left: 10px; 
  }
 .UserNameCard{
   font-size: 20px;
   .anticon{
         font-size: 26px;
    vertical-align: text-bottom;
        position: relative;
    left: -5px;
   }
 }
.clear {
  clear: both;
}
.ant-col-4 .ant-calendar-picker,
.ant-col-6 .ant-calendar-picker {
  width: 100%;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}

/deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: #CFF4FF;
}


/deep/.ant-menu-vertical .ant-menu-item:after, .ant-menu-vertical-left .ant-menu-item:after, .ant-menu-vertical-right .ant-menu-item:after, .ant-menu-inline .ant-menu-item:after{
      border-right: 6px solid #1890ff;
}
/deep/ .ant-row {
  clear: both;
}
.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 10px 15px;
  }
  /deep/ .tree-title {
    border-right: 1px solid #e8e8e8;
    color: #25aefe;
    font-size: 22px;
    padding-left: 70px;
    padding-top: 5px;
    padding-bottom: 10px;
    background-image: url(../../../assets/treeTop.png);
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
    padding-left: 20p;
    background-position-x: 15px;
    padding-bottom: 26px;
  }
  /deep/ .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu .ant-menu-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    margin: 0;
  }
  /deep/ .ant-menu-submenu-title {
    height: 50px;
    line-height: 50px;
  }
  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open {
    background-color: rgba(245,251,255);
    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245,251,255);
      li {
        border-bottom: none;
            height: 40px;
        line-height: 40px;
      }
    }
  }
    /deep/ li.ant-menu-submenu.ant-menu-submenu-inline {
    .ant-menu.ant-menu-inline.ant-menu-sub {
      li {
        border-bottom: none;
        height: 40px;
        line-height: 40px;
      }
    }
  }
  /deep/ .ant-menu-item {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    margin: 0;
    .ant-menu-item:hover,
    .ant-menu-item-active,
    .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
    .ant-menu-submenu-active,
    .ant-menu-submenu-title:hover {
      background-color: #eaf2fd;
    }
    .placeholderI {
      display: inline-block;
      width: 27px;
    }
    .anticon.anticon-check-circle {
      font-size: 18px;
      color: #8ac51b;
    }
    .anticon.anticon-clock-circle {
      font-size: 18px;
      color: #06a0e2;
    }
    .treeSubTitle {
      font-size: 16px;
      margin-left: 10px;
      display: inline-block;
      width: 140px;
    }
    .treeSubPercentage {
      font-size: 16px;
      margin-left: 10px;
    }
  }
  /deep/ .ant-menu-submenu {
    &.ant-menu-submenu-inline {
      .treeSubTitle {
        font-size: 16px;
        margin-left: 10px;
        display: inline-block;
        width: 140px;
      }
      .treeSubPercentage {
        font-size: 16px;
        margin-left: 10px;
      }
      .action {
        font-size: 18px;
        &.anticon-check-circle {
          color: #8ac51b;
        }
        &.anticon-clock-circle {
          color: #06a0e2;
        }
      }
      .placeholderI {
        display: inline-block;
        width: 27px;
      }
    }
  }
  .fr {
    float: right;
  }
  .btn {
    margin-right: 10px;
  }
  .baselineForm {
    height: 350px;
    overflow: auto;

    padding: 20px;
    .ant-row {
      // padding-bottom: 10px;
      // padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #eee;
      &.no-border{
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }
      &:hover {
      }
    }
    /deep/ .ant-form-item-label {
      text-align: left;
      label:after {
        content: '';
      }
      &.ant-col-md-24 label {
        display: block;
        background-color: #f7f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
      }
    }
    .formSubtitle {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      font-size: 16px;
      padding-left: 10px;
      margin-bottom: 0px;
      background: #fafcfd;
      border-bottom: 1px solid #f3f3f3;
    }
    .itemRow:hover {
      background-color: #e6f7ff;
    }
  }
}
.question-title{
  text-align: center;
  font-size: 22px;
  color: #3398DC;
}
.question-des{
  font-size: 16px;
  // border: 1px solid #91D5FF ;
  // border-radius: 3px;
  // background: lightblue;
  padding:0 10px ;
}
.question-t{
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
}
/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle{
  width: 120px;
}
/deep/.ant-menu-inline .ant-menu-submenu-title {
     padding-right: 0px;
}
</style>