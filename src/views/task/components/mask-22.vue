<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;" v-if="!isGroup">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="5" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhehuaban" />
          受访者：{{ patient.name }}
        </a-col>
        <a-col :md="7" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          身份证：{{ patient.card }}
        </a-col>
        <a-col :md="11" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" class="card-box">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19" style="height:100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="btn-array" v-if="executeStatus !== 2 && !isGroup">
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2">
              <a-button class="btn fr" type="primary" @click="withdraw">撤回</a-button>
            </div>

            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.肺功能相关检查</div>
              <a-form-item label="报告上传 :" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <div class="clearfix" style="margin-top: 10px;">
                  <a-upload :action="uploadUrl" listType="picture-card" :fileList="fileList1" @preview="handlePreview1" @change="handleChange1">
                    <div v-if="fileList1.length < 1">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-button style="position: absolute;top: 84px;left: 120px;font-size: 12px;padding: 0 5px;height: 30px;" @click="_importF" v-if="fileList1.length === 1">OCR识别</a-button>
                  <!-- <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
                    <img alt="example" style="width: 100%" :src="previewImage1" />
                  </a-modal> -->
                </div>
              </a-form-item>
              <a-form-item label="肺功能测试名称" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-row type="flex">
                  <a-col :span="12">实际值</a-col>
                  <a-col :span="12">实/预%</a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {...inputRequired, initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a21', {...inputRequired, initialValue: initValue('a21')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a22', {...inputRequired, initialValue: initValue('a22')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="FEV1::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {...inputRequired, initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a31', {...inputRequired, initialValue: initValue('a31')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a32', {...inputRequired, initialValue: initValue('a32')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="FEV1%FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {...inputRequired, initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a41', {...inputRequired, initialValue: initValue('a41')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="FEV1%VC MAX::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a51', {initialValue: initValue('a51')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a52', {initialValue: initValue('a52')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="FEV3::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a61', {initialValue: initValue('a61')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['a62', {initialValue: initValue('a62')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="FEV3%FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b21', {initialValue: initValue('b21')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b22', {initialValue: initValue('b22')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="PEF::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b31', {initialValue: initValue('b31')}]" addonAfter="L/s" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b32', {initialValue: initValue('b32')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="MEF 75::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b41', {initialValue: initValue('b41')}]" addonAfter="L/s" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b42', {initialValue: initValue('b42')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="MEF 50::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b51', {initialValue: initValue('b51')}]" addonAfter="L/s" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b52', {initialValue: initValue('b52')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="MEF 25::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b61', {initialValue: initValue('b61')}]" addonAfter="L/s" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b62', {initialValue: initValue('b62')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="MMEF::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b71', {initialValue: initValue('b71')}]" addonAfter="L/s" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b72', {initialValue: initValue('b72')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="MVV::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b81', {initialValue: initValue('b81')}]" addonAfter="L/min" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b82', {initialValue: initValue('b82')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="FEV 1*30::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b91', {initialValue: initValue('b91')}]" addonAfter="L/min" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b92', {initialValue: initValue('b92')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="RV::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b101', {initialValue: initValue('b101')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b102', {initialValue: initValue('b102')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="TLC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b111', {initialValue: initValue('b111')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b112', {initialValue: initValue('b112')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="RV%TLC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-input v-decorator="['t1', {initialValue: '1'}]" style="display: none;"></a-input>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b121', {initialValue: initValue('b121')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b122', {initialValue: initValue('b122')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="ITGV::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b131', {initialValue: initValue('b131')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b132', {initialValue: initValue('b132')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="IC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b141', {initialValue: initValue('b141')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b142', {initialValue: initValue('b142')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="ERV::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b151', {initialValue: initValue('b151')}]" addonAfter="L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%',border: 'none' }">
                  <a-input style="width: 240px;" v-decorator="['b152', {initialValue: initValue('b152')}]" addonAfter="%" autocomplete="off"></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item label="(2) 是否做过其他舒张试验:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['c', {...require1, initialValue: initValue('c')}]" @change="changeRadio($event, 'controlc')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlc">
                <a-form-item label="报告上传 :" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <div class="clearfix" style="margin-top: 10px;">
                    <a-upload :action="uploadUrl" listType="picture-card" :fileList="fileList2" @preview="handlePreview2" @change="handleChange2">
                      <div v-if="fileList2.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Upload</div>
                      </div>
                    </a-upload>
                    <a-button style="position: absolute;top: 84px;left: 120px;font-size: 12px;padding: 0 5px;height: 30px;" @click="_importS" v-if="fileList2.length === 1">OCR识别</a-button>
                    <!-- <a-modal :visible="previewVisible2" :footer="null" @cancel="handleCancel2">
                      <img alt="example" style="width: 100%" :src="previewImage2" />
                    </a-modal> -->
                  </div>
                </a-form-item>
                <a-form-item label="舒张试验名称" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-row type="flex">
                    <a-col :span="12">前次</a-col>
                    <a-col :span="12">后次</a-col>
                  </a-row>
                </a-form-item>
                <a-form-item label="VC MAX::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c11', { initialValue: initValue('c11')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c12', { initialValue: initValue('c12')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c21', { initialValue: initValue('c21')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c22', { initialValue: initValue('c22')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="FEV1::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c31', { initialValue: initValue('c31')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c32', { initialValue: initValue('c32')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="FEV1%FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c41', { initialValue: initValue('c41')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="FEV1%VC MAX::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c51', { initialValue: initValue('c51')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c52', { initialValue: initValue('c52')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="FEV3::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c61', { initialValue: initValue('c61')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c62', { initialValue: initValue('c62')}]" addonAfter="L" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="FEV3%FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c71', { initialValue: initValue('c71')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c72', { initialValue: initValue('c72')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="PEF::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c81', { initialValue: initValue('c81')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c82', { initialValue: initValue('c82')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="MEF 75::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c91', { initialValue: initValue('c91')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c92', { initialValue: initValue('c92')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="MEF 50::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c101', { initialValue: initValue('c101')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c102', { initialValue: initValue('c102')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="MEF 25::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c111', { initialValue: initValue('c111')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c112', { initialValue: initValue('c112')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="MEF 75/25::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c121', { initialValue: initValue('c121')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c122', { initialValue: initValue('c122')}]" addonAfter="L/s" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="V%FVC::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c131', { initialValue: initValue('c131')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c132', { initialValue: initValue('c132')}]" addonAfter="%" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
                <a-form-item label="MVV::" :labelCol="labelXs" :wrapperCol="wrapperMx">
                  <a-form-item :labelCol="labelXs" :wrapperCol="wrapperMx" :style="{ display: 'inline-block', width: '50%', border: 'none' }">
                    <a-input style="width: 240px;" v-decorator="['c141', { initialValue: initValue('c141')}]" addonAfter="L/min" autocomplete="off"></a-input>
                  </a-form-item>
                </a-form-item>
              </div>
              <a-form-item label="(3) 肺功能结论:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['d', {...require1, initialValue: initValue('d')}]" @change="changeRadio($event, 'controld')">
                  <a-radio value="1">通气功能正常</a-radio>
                  <a-radio value="-1">通气功能减退</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="通气功能减退类型:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controld">
                <a-radio-group v-decorator="['e12', {...require1, initialValue: initValue('e12')}]">
                  <a-radio value="1">阻塞性</a-radio>
                  <a-radio value="2">限制性</a-radio>
                  <a-radio value="3">混合型</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(4) 呼出气一氧化氮(FeNO):" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-input addonAfter="ppb" style="width: 240px;" v-decorator="['d1', {...inputRequired, initialValue: initValue('d1')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(5) 6分钟步行试验总距离:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-input addonAfter="m" style="width: 240px;" v-decorator="['e', {...inputRequired, initialValue: initValue('e')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 血气分析:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
              </a-form-item>
              <a-form-item label="PH:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['f', {...inputRequired, initialValue: initValue('f')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="氧分压:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['f1', {...inputRequired, initialValue: initValue('f1')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="二氧化碳分压:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['f2', {...inputRequired, initialValue: initValue('f2')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="肺动脉氧分压差:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['f3', {...inputRequired, initialValue: initValue('f3')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="氧饱和度:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="no-border">
                <a-input style="width: 240px;" v-decorator="['f4', {...inputRequired, initialValue: initValue('f4')}]" autocomplete="off"></a-input>
              </a-form-item>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    <a-spin :spinning="spinning"></a-spin>
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree'
import moment from 'moment'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm, recoverSubmit } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import { getOcrResult } from '@/api/basis'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'task22',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
    //   previewVisible1: false,
    //   previewImage1: '',
    //   previewVisible2: false,
    //   previewImage2: '',
      uploadUrl: process.env.VUE_APP_API_UPLOAD_URL,
      viewPicUrl: process.env.VUE_APP_API_VIEW_PIC_URL,
      fileList1: [],
      fileList2: [],
      markName: 'fgnxgjc',
      title: '年访视',
      openKeys: [],
      defaultSelectedKeys: [22],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: '100%',
        "padding-right": "0px",
        "border-right": "1px solid #ddd"
      },
      baselineFormStyle: {
        // height: '444px',
        'padding-top': '52px'
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 7 }
      },
      labelXs: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 5 }
      },
      wrapperMx: {
        xs: { span: 24 },
        sm: { span: 19 },
        md: { span: 19 }
      },
      wrapper18: {
        md: { span: 18 }
      },
      labelColVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 17 },
        md: { span: 17 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      labelColOffset: {
        md: { span: 4, offset: 7 }
      },
      wrapperOffset: {
        md: { span: 13 }
      },
      dateRequire: {
        rules: [{ type: 'object', required: true, message: '请选择时间！' }]
      },
      require1: {
        rules: [{ required: true, message: '请选择是或否！' }]
      },
      require2: {
        rules: [{ required: true, message: '请选择有或无！' }]
      },
      selectRequired: {
        rules: [{ required: true, message: '请选择！' }]
      },
      inputRequired: {
        rules: [{ required: true, message: '请填写！' }]
      },
      form: this.$form.createForm(this),
      maskId: this.$route.meta.maskId,
      patientBasisId: this.$route.params.id,
      fgnxgjc: undefined,
    //   controla1p: false,
    //   controla1n: false,
      controla21: false,
      controla31: false,
      controla41: false,
      controla51: false,
      controla61: false,
      controlb23: false,
      controlb33: false,
      controlb43: false,
      controlb53: false,
      controlb63: false,
      controlc: false,
      controlc11: false,
      controlc21: false,
      controlc31: false,
      controlc41: false,
      controld: false,
      spinning: false,
      executeStatus: false,
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false
    }
  },
  created() {
    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
      })
    this.getFormData()
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controld') {
        if (e.target.value === '-1') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    handleClick(e) {
      if ((e.key >= 37 && e.key <= 42) || (e.key >= 45 && e.key <= 50)) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else {
        this.$router.replace('/list/task/' + this.patientBasisId + '/' + e.key)
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      this.confirmLoading = true
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var re = this.form.getFieldsValue()
          var that = this
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.fgnxgjc && this.fgnxgjc.fgnxgjcId) {
            re.fgnxgjcId = this.fgnxgjc.fgnxgjcId
          }
          //附件
          if (this.fileList1 && this.fileList1.length) {
            var a = []
            _.each(this.fileList1, function(v) {
              if (v.response) a.push(v.response.fileName)
              else a.push(v.name)
            })
            params.append('fileName', JSON.stringify(a))
          }
          //附件
          if (this.fileList2 && this.fileList2.length) {
            var a = []
            _.each(this.fileList2, function(v) {
              if (v.response) a.push(v.response.fileName)
              else a.push(v.name)
            })
            params.append('fileNameOther', JSON.stringify(a))
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          this.spinning = true
          saveBasis(params)
            .then(res => {
              console.log(res)
              that.spinning = false
              that.getFormData()
              that.$message.success(res.msg)
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
                })
                .catch(error => {
                  console.log(error)
                })
            })
            .catch(error => {
              that.spinning = false
              console.log(error)
            })
        } else {
          this.spinning = false
        }
      })
    },
    initValue(key, type = 'normal') {
      if (!this.fgnxgjc) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.fgnxgjc[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.fgnxgjc[key])
      } else if (type === 'array') {
        return this.fgnxgjc[key].split(',')
      } else {
        return this.fgnxgjc[key] + ''
      }
    },
    dealAnswers(answer) {
      if (answer && !_.isEmpty(answer)) {
        if (answer.a21 === 1) {
          this.controla21 = true
        }
        if (answer.a31 === 1) {
          this.controla31 = true
        }
        if (answer.a41 === 1) {
          this.controla41 = true
        }
        if (answer.a51 === 1) {
          this.controla51 = true
        }
        if (answer.a61 === 1) {
          this.controla61 = true
        }
        if (answer.b23 === 1) {
          this.controlb23 = true
        }
        if (answer.b33 === 1) {
          this.controlb33 = true
        }
        if (answer.b43 === 1) {
          this.controlb43 = true
        }
        if (answer.b53 === 1) {
          this.controlb53 = true
        }
        if (answer.b63 === 1) {
          this.controlb63 = true
        }
        if (answer.c === 1) {
          this.controlc = true
        }
        if (answer.c11 === 1) {
          this.controlc11 = true
        }
        if (answer.c21 === 1) {
          this.controlc21 = true
        }
        if (answer.c31 === 1) {
          this.controlc31 = true
        }
        if (answer.c41 === 1) {
          this.controlc41 = true
        }
        if (answer.d === -1) {
          this.controld = true
        }
      }
      return answer
    },
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.fgnxgjc) {
            that.fgnxgjc = that.dealAnswers(res.data.fgnxgjc)
          } else {
            that.fgnxgjc = {}
            that.form.resetFields()
          }
          if (res.data.annexListFgn && res.data.annexListFgn.length) {
            that.fileList1 = _.map(res.data.annexListFgn, function(v) {
              return {
                uid: v.annexId,
                url: that.viewPicUrl + v.annexAddress,
                name: v.annexAddress,
                status: 'done'
              }
            })
          } else {
            that.fileList1 = []
          }
          if (res.data.annexListQH && res.data.annexListQH.length) {
            that.fileList2 = _.map(res.data.annexListQH, function(v) {
              return {
                uid: v.annexId,
                url: that.viewPicUrl + v.annexAddress,
                name: v.annexAddress,
                status: 'done'
              }
            })
          } else {
            that.fileList2 = []
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.fgnxgjc && this.fgnxgjc.fgnxgjcId) {
        re.fgnxgjcId = this.fgnxgjc.fgnxgjcId
      }
      //附件
      if (this.fileList1 && this.fileList1.length) {
        var a = []
        _.each(this.fileList1, function(v) {
          if (v.response) a.push(v.response.fileName)
          else a.push(v.name)
        })
        params.append('fileName', JSON.stringify(a))
      }
      //附件
      if (this.fileList2 && this.fileList2.length) {
        var a = []
        _.each(this.fileList2, function(v) {
          if (v.response) a.push(v.response.fileName)
          else a.push(v.name)
        })
        params.append('fileNameOther', JSON.stringify(a))
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      this.spinning = true
      saveBasis(params)
        .then(res => {
          console.log(res)
          that.spinning = false
          that.getFormData()
          that.$message.success(res.msg)
          params = new URLSearchParams()
          params.append('patientBasisId', that.patientBasisId)
          getPatientBasis(params)
            .then(res => {
              that.orgTree = res.data.list
              that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    // handleCancel1() {
    //   this.previewVisible1 = false;
    // },
    handlePreview1(file) {
      const viewer = this.$el.querySelector('.images1').$viewer
      viewer.show()
    //   this.previewImage1 = file.url || file.thumbUrl;
    //   this.previewVisible1 = true;
    },
    handleChange1({ fileList }) {
      this.fileList1 = fileList;
    },
    // handleCancel2() {
    //   this.previewVisible2 = false;
    // },
    handlePreview2(file) {
      const viewer = this.$el.querySelector('.images2').$viewer
      viewer.show()
    //   this.previewImage2 = file.url || file.thumbUrl;
    //   this.previewVisible2 = true;
    },
    handleChange2({ fileList }) {
      this.fileList2 = fileList;
    },
    _importF() {
      this.spinning = true
      var params = new URLSearchParams()
      params.append('type', 4)
      params.append('url', this.fileList1[0].response.data.src)
      var that = this
      getOcrResult(params)
        .then(res => {
          console.log(res.data)
          that.spinning = false
          that.$message.success(res.data.info)
          that.fgnxgjc = _.extend(that.fgnxgjc || {}, that.dealAnswers(res.data))
        })
        .catch(error => {
          that.confirmLoading = false
        })
    },
    _importS() {
      this.spinning = true
      var params = new URLSearchParams()
      params.append('type', 3)
      params.append('url', this.fileList2[0].response.data.src)
      var that = this
      getOcrResult(params)
        .then(res => {
        //   console.log(res.data)
          that.spinning = false
          that.$message.success(res.data.info)
          that.fgnxgjc = _.extend(that.fgnxgjc || {}, that.dealAnswers(res.data))
        //   that.form.setFieldsValue(that.fgnxgjc)
        })
        .catch(error => {
          that.confirmLoading = false
        })
    },
    withdraw(){
      var that = this
      this.$confirm({
        title: '确认撤销？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('patientBasisMarkId', that.fgnxgjc.patientBasisMarkId)
          recoverSubmit(params)
            .then(res => {
              that.spinning = false
              that.$message.success(res.msg)
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list[2].childList, function(v) { return v.basisMarkId === that.maskId }).executeStatus
                })
                .catch(error => {
                  console.log(error)
                })
            }).catch(error => {
              that.spinning = false
              console.log(error)
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#baselineInfo {
  height: calc(100% - 10px);
}

/deep/ .card-box {
  margin-top: 10px;
  padding-left: 0;
  height: calc(100% - 54px);
}

/deep/ .ant-spin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .2);
  z-index: 2;

  & .ant-spin-dot {
    position: absolute;
    top: 55%;
    left: 50%;
  }
}

/deep/ #baselineHeader {
  .ant-card-body {
    padding: 10px
  }
}

.ant-row.ant-form-item:hover {
  background-color: #e6f7ff;
}

.ml-10 {
  margin-left: 10px;
}

.UserNameCard {
  font-size: 20px;

  .anticon {
    font-size: 26px;
    vertical-align: text-bottom;
    position: relative;
    left: -5px;
  }
}

.clear {
  clear: both;
}

.ant-calendar-picker {
  width: 240px;
}

.ant-checkbox-wrapper+.ant-checkbox-wrapper {
  margin-left: 0;
}

/deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #1890FF;
  color: #FFF;

  .anticon.anticon-clock-circle,
  .anticon.anticon-check-circle {
    color: #FFF;
  }
}

/deep/ .anticon.anticon-clock-circle,
/deep/ .anticon.anticon-check-circle {
  font-size: 18px;
}

/deep/ .ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  background-color: #e6f7ff;
}

/deep/.ant-menu-vertical .ant-menu-item:after,
.ant-menu-vertical-left .ant-menu-item:after,
.ant-menu-vertical-right .ant-menu-item:after,
.ant-menu-inline .ant-menu-item:after {
  border-right: 6px solid #1890ff;
}

/deep/ .ant-row {
  clear: both;
  height: 100%;
}

.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 0;
    height: 100%;
  }

  /deep/ .tree-title {
    color: #25aefe;
    font-size: 20px;
    padding-left: 70px;
    padding-top: 18px;
    padding-bottom: 10px;
    background-image: url(../../../assets/treeTop.png);
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
    background-position: 8px 10px;
  }

  /deep/ .ant-menu-inline>.ant-menu-submenu>.ant-menu-submenu-title,
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

  /deep/ .anticon.anticon-clock-circle {
    color: #00A0E9;
  }

  /deep/ .anticon.anticon-clock-circle {
    color: #8ac51b;
  }

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline {
    background-color: rgba(245, 251, 255);

    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245, 251, 255);
      padding-left: 20px;
      .treeSubTitle{
        font-size: 14px;
      }
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
    .anticon-check-circle {
      color: #8ac51b;
    }

    .anticon-clock-circle {
      color: #06a0e2;
    }

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

  .btn-array {
    overflow: hidden;
    position: absolute;
    padding-top: 10px;
    padding-right: 20px;
    width: calc(100% - 8px);
    // height: 42px;
    background: #fff;
    z-index: 1;
    padding-bottom: 10px;
    bottom: 0;
  }

  .baselineForm {

    overflow: auto;

    .title {
      background-color: #f7f8f8;
      font-weight: bold;
      font-size: 16px;
      color: #231815;
      padding-left: 15px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      height: 40px;
      line-height: 40px;
    }

    padding: 40px 20px;

    .ant-form-item {
      // padding-bottom: 10px;
      // padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #eee;

      &.no-border {
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }

      &:hover {}

      &.border-dotted {
        border-bottom: 1px dotted #eee;
      }
    }

    /deep/ .ant-form-item-label {
      text-align: left;
      line-height: 56px;
      white-space: inherit;

      label:after {
        content: '';
      }

      &.ant-col-md-24 label {
        display: block;
        background-color: #f7f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
        padding-left: 15px;
        border-top: 1px solid #eee;
      }
    }

    /deep/ .ant-form-item-control-wrapper .ant-form-item-control {
      line-height: 56px;
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

.question-title {
  text-align: center;
  font-size: 22px;
  color: #3398DC;
}

.question-des {
  font-size: 16px;
  // border: 1px solid #91D5FF ;
  // border-radius: 3px;
  // background: lightblue;
  padding: 0 10px;
}

.question-t {
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
}

/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle {
  width: 120px;
}

/deep/.ant-menu-inline .ant-menu-submenu-title {
  padding-right: 0px;
}

.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
</style>