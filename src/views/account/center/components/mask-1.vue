<template>
  <div id="baselineInfo" class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" id="baselineHeader" style="background-color: #0399EC;color:#FFFFFF;">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4">
          <a-icon type="left" style="fontSize:18px;cursor: pointer;" @click="$router.back(-1)" />
        </a-col>
        <a-col :md="5" :sm="20" class="UserNameCard">
          <my-icon type="iconshoufangzhehuaban" />
          受访者:{{ patient.name }}
        </a-col>
        <a-col :md="6" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          {{ patient.card }}
        </a-col>
        <a-col :md="12" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px;padding-left: 0">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19">
          <a-form :form="form" @submit="handleSubmit" :layout="formLayout">
            <div style="overflow: hidden;margin-top: 10px;">
              <!-- <a-button class="btn fr" v-if="patientBasis.type === 3" @click="import">导入</a-button> -->
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.基本病史</div>
              <a-form-item label="(1) 留全血" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a1', {...require1, initialValue: initValue('a1')}]">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(2) 留血清" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a2', {...require1, initialValue: initValue('a2')}]">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(3) 患者支扩确诊时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" v-decorator="['a3', {...dateRequire, initialValue: initValue('a3', 'time')}]" :disabledDate="disabledDate" style="width: 240px;"></a-date-picker>
              </a-form-item>
              <a-form-item label="(4) 主要临床症状（多选）" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['a4', {...selectRequired, initialValue: initValue('a4', 'array')}]">
                  <a-checkbox value="1">咳嗽</a-checkbox>
                  <a-checkbox value="2" :checked="controla41" @change="changeSelect($event, 'controla41')">咳痰</a-checkbox>
                  <a-checkbox value="3">痰血</a-checkbox>
                  <a-checkbox value="4" :checked="controla42" @change="changeSelect($event, 'controla42')">咯血</a-checkbox>
                  <a-checkbox value="5">胸闷</a-checkbox>
                  <a-checkbox value="6">喘息</a-checkbox>
                  <a-checkbox value="7">活动后气促</a-checkbox>
                  <a-checkbox value="8">胸痛</a-checkbox>
                  <a-checkbox value="9">发热</a-checkbox>
                  <a-checkbox value="10">全身疲乏</a-checkbox>
                  <a-checkbox value="11">纳差</a-checkbox>
                  <a-checkbox value="12">消瘦</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="痰量" v-if="controla41" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['a41', {...inputRequired, initialValue: initValue('a41')}]"></a-input>
              </a-form-item>
              <a-form-item label="咯血量(最多)" v-if="controla42" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['a42', {...inputRequired, initialValue: initValue('a42')}]"></a-input>
              </a-form-item>
              <div class="title">2.既往病史</div>
              <a-form-item label="(1) 过去一年的急性加重次数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="次" style="width: 240px;" v-decorator="['b1', {...inputRequired, initialValue: initValue('b1')}]"></a-input>
              </a-form-item>
              <a-form-item label="(2) 过去一年的住院急性加重次数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="次" style="width: 240px;" v-decorator="['b2', {...inputRequired, initialValue: initValue('b2')}]"></a-input>
              </a-form-item>
              <a-form-item label="(3) 过去一年的门诊急性加重次数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="次" style="width: 240px;" v-decorator="['b3', {...inputRequired, initialValue: initValue('b3')}]"></a-input>
              </a-form-item>
              <a-form-item label="(4) 最后一次急性加重的时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" :disabledDate="disabledDate" v-decorator="['b4', {...dateRequire, initialValue: initValue('b4', 'time')}]"></a-date-picker>
              </a-form-item>
              <a-form-item label="(5) 有无以下疾病及事件（多选）" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['b5', {...selectRequired, initialValue: initValue('b5', 'array')}]">
                  <a-checkbox value="1">既往有无麻疹</a-checkbox>
                  <a-checkbox value="2">百日咳</a-checkbox>
                  <a-checkbox value="3">肺结核</a-checkbox>
                  <a-checkbox value="4">NTM</a-checkbox>
                  <a-checkbox value="5">溺水</a-checkbox>
                  <a-checkbox value="6">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="(6) 目前合并呼吸系统相关疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['b6', {...selectRequired, initialValue: initValue('b6', 'array')}]">
                  <a-checkbox value="1" :checked="controlb61" @change="changeSelect($event, 'controlb61')">鼻炎</a-checkbox>
                  <a-checkbox value="2" :checked="controlb62" @change="changeSelect($event, 'controlb62')">鼻窦炎</a-checkbox>
                  <a-checkbox value="3" :checked="controlb63" @change="changeSelect($event, 'controlb63')">鼻息肉</a-checkbox>
                  <a-checkbox value="4" :checked="controlb64" @change="changeSelect($event, 'controlb64')">哮喘</a-checkbox>
                  <a-checkbox value="5" :checked="controlb65" @change="changeSelect($event, 'controlb65')">慢阻肺</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="鼻炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb61">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b61', {...dateRequire, initialValue: initValue('b61', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item class="no-border" label="鼻窦炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb62">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b62', {...dateRequire, initialValue: initValue('b62', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item class="no-border" label="鼻息肉具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb63">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b63', {...dateRequire, initialValue: initValue('b63', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item class="no-border" label="哮喘具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb64">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b64', {...dateRequire, initialValue: initValue('b64', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item class="no-border" label="慢阻肺具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb65">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b65', {...dateRequire, initialValue: initValue('b65', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item label="(7) 心血管系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b7', {...require2, initialValue: initValue('b7')}]" @change="changeRadio($event, 'controlb7')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="no-border" label="心血管系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb7">
                <a-checkbox-group v-decorator="['b71', {...selectRequired, initialValue: initValue('b71', 'array')}]">
                  <a-checkbox value="1">心梗</a-checkbox>
                  <a-checkbox value="2">心绞痛</a-checkbox>
                  <a-checkbox value="3">冠心病</a-checkbox>
                  <a-checkbox value="4">慢性心衰</a-checkbox>
                  <a-checkbox value="5">心律失常</a-checkbox>
                  <a-checkbox value="6">心脏瓣膜病</a-checkbox>
                  <a-checkbox value="7">肺动脉高压</a-checkbox>
                  <a-checkbox value="8">中风或短暂性缺血发作</a-checkbox>
                  <a-checkbox value="9">外周血管疾病</a-checkbox>
                  <a-checkbox value="10" :checked="controlb72" @change="changeSelect($event, 'controlb72')">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb7 && controlb72">
                <a-input style="width: 240px;" v-decorator="['b72', {...inputRequired, initialValue: initValue('b72')}]"></a-input>
              </a-form-item>
              <a-form-item label="(8) 消化系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b8', {...require2, initialValue: initValue('b8')}]" @change="changeRadio($event, 'controlb8')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="no-border" label="消化系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb8">
                <a-checkbox-group v-decorator="['b81', {...selectRequired, initialValue: initValue('b81', 'array')}]">
                  <a-checkbox value="1" :checked="controlb811" @change="changeSelect($event, 'controlb811')">炎性肠病</a-checkbox>
                  <a-checkbox value="2">胃食管反流</a-checkbox>
                  <a-checkbox value="3">消化道溃疡</a-checkbox>
                  <a-checkbox value="4">慢性肝病</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="炎性肠病:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb8 && controlb811">
                <a-radio-group v-decorator="['b811', {...require2, initialValue: initValue('b811')}]">
                  <a-radio value="1">溃疡性结肠炎</a-radio>
                  <a-radio value="2">克罗恩病</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(9) 内分泌系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b9', {...require2, initialValue: initValue('b9')}]" @change="changeRadio($event, 'controlb9')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="no-border" label="内分泌系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb9">
                <a-checkbox-group v-decorator="['b91', {...selectRequired, initialValue: initValue('b91', 'array')}]">
                  <a-checkbox value="1" :checked="controlb911" @change="changeSelect($event, 'controlb911')">糖尿病</a-checkbox>
                  <a-checkbox value="2">骨质疏松</a-checkbox>
                  <a-checkbox value="3">高脂血症</a-checkbox>
                  <a-checkbox value="4">甲亢</a-checkbox>
                  <a-checkbox value="5">甲减</a-checkbox>
                  <a-checkbox value="6">高尿酸血症</a-checkbox>
                  <a-checkbox value="7">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="糖尿病:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb9 && controlb911">
                <a-radio-group v-decorator="['b911', {...require2, initialValue: initValue('b911')}]">
                  <a-radio value="1">I型</a-radio>
                  <a-radio value="2">II型</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(10) 血液系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b10', {...require2, initialValue: initValue('b10')}]" @change="changeRadio($event, 'controlb10')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="no-border" label="血液系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb10">
                <a-checkbox-group v-decorator="['b101', {...selectRequired, initialValue: initValue('b101', 'array')}]">
                  <a-checkbox value="1" :checked="controlb1011" @change="changeSelect($event, 'controlb1011')">缺铁性贫血</a-checkbox>
                  <a-checkbox value="2">白血病</a-checkbox>
                  <a-checkbox value="3">淋巴瘤</a-checkbox>
                  <a-checkbox value="4">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="缺铁性贫血:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb10 && controlb1011">
                <a-radio-group v-decorator="['b1011', {...require2, initialValue: initValue('b1011')}]">
                  <a-radio value="1">I型</a-radio>
                  <a-radio value="2">II型</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(11) 泌尿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b11', {...require2, initialValue: initValue('b11')}]" @change="changeRadio($event, 'controlb11')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="no-border" label="泌尿系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb11">
                <a-checkbox-group v-decorator="['b111', {...selectRequired, initialValue: initValue('b111', 'array')}]">
                  <a-checkbox value="1" :checked="controlb1111" @change="changeSelect($event, 'controlb1111')">慢性肾病</a-checkbox>
                  <a-checkbox value="2">慢性尿路感染</a-checkbox>
                  <a-checkbox value="3">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="慢性肾病:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb11 && controlb1111">
                <a-radio-group v-decorator="['b1111', {...require2, initialValue: initValue('b1111')}]">
                  <a-radio value="1">有透析</a-radio>
                  <a-radio value="-1">无透析</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(12) 风湿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b12', {...require2, initialValue: initValue('b12')}]" @change="changeRadio($event, 'controlb12')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item class="no-border" label="风湿系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb12">
                <a-checkbox-group v-decorator="['b121', {...selectRequired, initialValue: initValue('b121', 'array')}]">
                  <a-checkbox value="1">系统性红斑狼疮</a-checkbox>
                  <a-checkbox value="2">干燥综合征</a-checkbox>
                  <a-checkbox value="3">系统性硬化</a-checkbox>
                  <a-checkbox value="4">皮肌炎</a-checkbox>
                  <a-checkbox value="5">先天性结缔组织发育不全病</a-checkbox>
                  <a-checkbox value="6">青少年特发性关节炎</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="(13) 是否有HIV" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b13', {...require1, initialValue: initValue('b13')}]">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(14) 是否有恶性肿瘤" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b14', {...require1, initialValue: initValue('b14')}]" @change="changeRadio($event, 'controlb14')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb14">
                <a-form-item class="border-dotted" label="当前正患病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b141', {...require1, initialValue: initValue('b141')}]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="血液性" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b142', {...require1, initialValue: initValue('b142')}]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="肿瘤部位(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b143', {...selectRequired, initialValue: initValue('b143', 'array')}]">
                    <a-checkbox value="1">头颈部</a-checkbox>
                    <a-checkbox value="2">肺</a-checkbox>
                    <a-checkbox value="3">乳腺</a-checkbox>
                    <a-checkbox value="4">胃</a-checkbox>
                    <a-checkbox value="5">小肠</a-checkbox>
                    <a-checkbox value="6">结肠</a-checkbox>
                    <a-checkbox value="7">肝</a-checkbox>
                    <a-checkbox value="8">胰腺</a-checkbox>
                    <a-checkbox value="9">肾</a-checkbox>
                    <a-checkbox value="10">前列腺</a-checkbox>
                    <a-checkbox value="11">膀胱</a-checkbox>
                    <a-checkbox value="12">子宫附件</a-checkbox>
                    <a-checkbox value="13">骨</a-checkbox>
                    <a-checkbox value="14">皮肤</a-checkbox>
                    <a-checkbox value="15">脑</a-checkbox>
                    <a-checkbox value="16">其他</a-checkbox>
                    <a-checkbox value="17">未知</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </div>
              <a-form-item label="(15) 免疫缺陷" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b15', {...require2, initialValue: initValue('b15')}]" @change="changeRadio($event, 'controlb15')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb15">
                <a-form-item class="border-dotted" label="B细胞缺陷类疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b151', {...inputRequired, initialValue: initValue('b151')}]"></a-input>
                </a-form-item>
                <a-form-item class="border-dotted" label="T细胞及联合免疫缺陷病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b152', {...inputRequired, initialValue: initValue('b152')}]"></a-input>
                </a-form-item>
                <a-form-item class="border-dotted" label="继发性免疫缺陷(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b153', {...selectRequired, initialValue: initValue('b153', 'array')}]">
                    <a-checkbox value="1">慢性淋巴性白血病</a-checkbox>
                    <a-checkbox value="2">多发性骨髓瘤</a-checkbox>
                    <a-checkbox value="3">血液肿瘤相关免疫缺陷</a-checkbox>
                    <a-checkbox value="4">系统化疗后免疫缺陷</a-checkbox>
                    <a-checkbox value="5">免疫抑制药物后免疫缺陷</a-checkbox>
                    <a-checkbox value="6">干细胞移植</a-checkbox>
                    <a-checkbox value="7">实体器官移植</a-checkbox>
                    <a-checkbox value="8">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="巨噬细胞缺陷疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b154', {...inputRequired, initialValue: initValue('b154')}]"></a-input>
                </a-form-item>
                <a-form-item class="border-dotted" label="补体缺陷疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b155', {...inputRequired, initialValue: initValue('b155')}]"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(16) 其他疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b16', {...require2, initialValue: initValue('b16')}]" @change="changeRadio($event, 'controlb16')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb16">
                <a-checkbox-group v-decorator="['b161', {...selectRequired, initialValue: initValue('b161', 'array')}]">
                  <a-checkbox value="1">抑郁</a-checkbox>
                  <a-checkbox value="2">焦虑</a-checkbox>
                  <a-checkbox value="3">认知功能障碍</a-checkbox>
                  <a-checkbox value="4">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="(17) 其他系统相关治疗" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
              </a-form-item>
              <a-form-item label="调脂" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['b171', {...require1, initialValue: initValue('b171')}]" @change="changeRadio($event, 'controlb171')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-row v-if="controlb171">
                <a-col :span="18" :push="6">
                  <a-form-item label="他汀类:" :labelCol="labelColHor" :wrapperCol="wrapper18" class="border-dotted">
                    <a-radio-group v-decorator="['b1711', {...require1, initialValue: initValue('b1711')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="抗凝" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['b172', {...require1, initialValue: initValue('b172')}]" @change="changeRadio($event, 'controlb172')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-row v-if="controlb172">
                <a-col :span="18" :push="6">
                  <a-form-item label="阿司匹林:" :labelCol="labelColHor" :wrapperCol="wrapper18" class="border-dotted">
                    <a-radio-group v-decorator="['b1721', {...require1, initialValue: initValue('b1721')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="非阿司匹林抑制剂（如：氯吡格雷）:" :labelCol="labelColHor" :wrapperCol="wrapper18" class="border-dotted label-overflow">
                    <a-radio-group v-decorator="['b1722', {...require1, initialValue: initValue('b1722')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="华法林/口服抗凝药:" :labelCol="labelColHor" :wrapperCol="wrapper18" class="border-dotted">
                    <a-radio-group v-decorator="['b1723', {...require1, initialValue: initValue('b1723')}]">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="-1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="(18) 家族史" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
              </a-form-item>
              <a-form-item label="是否近亲结婚史" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['b181', {...require1, initialValue: initValue('b181')}]">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="既往直系亲属有无支扩" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['b182', {...require1, initialValue: initValue('b182')}]">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="遗传性疾病病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b183', {...require1, initialValue: initValue('b183')}]" @change="changeRadio($event, 'controlb1831')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="具体疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlb1831">
                <a-input style="width: 240px;" v-decorator="['b1831', {...inputRequired, initialValue: initValue('b1831')}]"></a-input>
              </a-form-item>
              <a-form-item label="(19) 吸烟史(单选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b19', {...selectRequired, initialValue: initValue('b19')}]" @change="changeRadio($event, 'controlb191')">
                  <a-radio value="1">既往吸烟</a-radio>
                  <a-radio value="2">已戒烟</a-radio>
                  <a-radio value="3">无吸烟</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="吸烟指数" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlb191">
                <a-input addonAfter="包/年" style="width: 240px;" v-decorator="['b191', {...inputRequired, initialValue: initValue('b191')}]"></a-input>
              </a-form-item>
              <a-form-item label="(20) 胸部手术病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b20', {...require2, initialValue: initValue('b20')}]" @change="changeRadio($event, 'controlb20')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="手术类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlb20">
                <a-checkbox-group v-decorator="['b201', {...selectRequired, initialValue: initValue('b201', 'array')}]">
                  <a-checkbox value="1" :checked="controlb202" @change="changeSelect($event, 'controlb202')">肺叶切除术</a-checkbox>
                  <a-checkbox value="2">胸膜剥脱术</a-checkbox>
                  <a-checkbox value="3">肺减容术</a-checkbox>
                  <a-checkbox value="4">胸腔闭式引流</a-checkbox>
                  <a-checkbox value="5">冠脉搭桥术</a-checkbox>
                  <a-checkbox value="6">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="肺叶切除术:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controlb20 && controlb202">
                <a-radio-group v-decorator="['b202', {...require2, initialValue: initValue('b202')}]">
                  <a-radio value="1">I型</a-radio>
                  <a-radio value="2">II型</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(21) 支气管动脉栓塞病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b21', {...require2, initialValue: initValue('b21')}]" @change="changeRadio($event, 'controlb21')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb21">
                <a-form-item label="若行支气管动脉栓塞术：时间" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b211', {...dateRequire, initialValue: initValue('b211', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="支气管动脉栓塞术部位" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b212', {...inputRequired, initialValue: initValue('b212')}]"></a-input>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import STree from '@/components/Tree/Tree'
import moment from 'moment'
import _ from 'lodash'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
export default {
  name: 'mask1',
  components: {
    STree,
    MyIcon
  },
  data() {
    return {
      formLayout: 'vertical',
      markName: 'zkbszl',
      title: '基线',
      openKeys: [],
      defaultSelectedKeys: [1],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: '486px',
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      baselineFormStyle: {
        height: '444px',
      },
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 }
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
        sm: { span: 18 },
        md: { span: 18 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      labelColOffset: {
        md: { span: 6, offset: 6 }
      },
      wrapperOffset: {
        md: { span: 12 }
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
      zkbszl: undefined,
      controla41: false,
      controla42: false,
      controlb61: false,
      controlb62: false,
      controlb63: false,
      controlb64: false,
      controlb65: false,
      controlb7: false,
      controlb72: false,
      controlb8: false,
      controlb811: false,
      controlb9: false,
      controlb911: false,
      controlb10: false,
      controlb1011: false,
      controlb11: false,
      controlb1111: false,
      controlb12: false,
      controlb14: false,
      controlb15: false,
      controlb16: false,
      controlb171: false,
      controlb172: false,
      controlb1831: false,
      controlb191: false,
      controlb20: false,
      controlb202: false,
      controlb21: false
    }
  },
  created() {
    var that = this
    this.defaultSelectedKeys = [1]
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
      })
      .catch(error => {
        console.log(error)
      })
    this.getFormData()
  },
  activated() {
    this.defaultSelectedKeys = [1]
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', this.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.zkbszl)
            that.zkbszl = that.dealAnswers(res.data.zkbszl)
        })
        .catch(error => {
          console.log(error)
        })
    },
    initValue(key, type = 'normal') {
      if (!this.zkbszl) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.zkbszl[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.zkbszl[key])
      } else if (type === 'array') {
        return this.zkbszl[key].split(',')
      } else {
        return this.zkbszl[key] + ''
      }
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    dealAnswers(answer) {
      var that = this
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.a4) {
          splitArr = answer.a4.split(',')
          if (splitArr.indexOf('2') > -1) {
            that.controla41 = true
          }
          if (splitArr.indexOf('4') > -1) {
            that.controla42 = true
          }
        }
        if (answer.b6) {
          splitArr = answer.b6.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb61 = true
          }
          if (splitArr.indexOf('2') > -1) {
            that.controlb62 = true
          }
          if (splitArr.indexOf('3') > -1) {
            that.controlb63 = true
          }
          if (splitArr.indexOf('4') > -1) {
            that.controlb64 = true
          }
          if (splitArr.indexOf('5') > -1) {
            that.controlb65 = true
          }
        }
        if (answer.b7) {
          if (answer.b7 === 1) {
            that.controlb7 = true
          }
        }
        if (answer.b71) {
          splitArr = answer.b71.split(',')
          if (splitArr.indexOf('10') > -1) {
            that.controlb72 = true
          }
        }
        if (answer.b8) {
          if (answer.b8 === 1) {
            that.controlb8 = true
          }
        }
        if (answer.b81) {
          splitArr = answer.b81.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb811 = true
          }
        }
        if (answer.b9 && answer.b9 === 1) {
          that.controlb9 = true
        }
        if (answer.b91) {
          splitArr = answer.b91.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb911 = true
          }
        }
        if (answer.b10 && answer.b10 === 1) {
          that.controlb10 = true
        }
        if (answer.b11 && answer.b11 === 1) {
          that.controlb11 = true
        }
        if (answer.b12 && answer.b12 === '1') {
          that.controlb12 = true
        }
        if (answer.b14 && answer.b14 === '1') {
          that.controlb14 = true
        }
        if (answer.b15 && answer.b15 === 1) {
          that.controlb15 = true
        }
        if (answer.b16 && answer.b16 === 1) {
          that.controlb16 = true
        }
        if (answer.b20 && answer.b20 === 1) {
          that.controlb20 = true
        }
        if (answer.b21 && answer.b21 === 1) {
          that.controlb21 = true
        }
        if (answer.b101) {
          splitArr = answer.b101.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb1011 = true
          }
        }
        if (answer.b111) {
          splitArr = answer.b111.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb1111 = true
          }
        }
        if (answer.b19 && (answer.b19 === 1 || answer.b19 === 2)) {
          that.controlb191 = true
        }
        if (answer.b183 && answer.b183 === 1) {
          that.controlb1831 = true
        }
        if (answer.b171 && answer.b171 === 1) {
          that.controlb171 = true
        }
        if (answer.b172 && answer.b172 === 1) {
          that.controlb172 = true
        }
        if (answer.b201) {
          splitArr = answer.b201.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb202 = true
          }
        }
      }
      return answer
    },
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controlb191') {
        if (e.target.value === '1' || e.target.value === '2') {
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
      this.maskId = e.key
      // this.getElementsAnswer()
      // location.href = '/list/basis/' + this.patientBasisId + '/' + this.maskId
      if (e.key >= 31 && e.key <= 36) {
        this.$router.push('/basis/question/' + this.patientBasisId + '/' + this.maskId)
      } else {
        this.$router.push('/list/basis/' + this.patientBasisId + '/' + this.maskId)
      }
    },
    handleSubmit(e) {
      e.preventDefault()
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
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      re = {
        ...re,
        'a3': typeof re['a3'] !== 'undefined' ? re['a3'].format('YYYY-MM-DD') : '',
        'a4': typeof re['a4'] !== 'undefined' ? re['a4'].join(',') : '',
        'b4': typeof re['b4'] !== 'undefined' ? re['b4'].format('YYYY-MM-DD') : '',
        'b5': typeof re['b5'] !== 'undefined' ? re['b5'].join(',') : '',
        'b6': typeof re['b6'] !== 'undefined' ? re['b6'].join(',') : '',
        'b61': typeof re['b61'] !== 'undefined' ? re['b61'].format('YYYY-MM-DD') : '',
        'b62': typeof re['b62'] !== 'undefined' ? re['b62'].format('YYYY-MM-DD') : '',
        'b63': typeof re['b63'] !== 'undefined' ? re['b63'].format('YYYY-MM-DD') : '',
        'b64': typeof re['b64'] !== 'undefined' ? re['b64'].format('YYYY-MM-DD') : '',
        'b65': typeof re['b65'] !== 'undefined' ? re['b65'].format('YYYY-MM-DD') : '',
        'b71': typeof re['b71'] !== 'undefined' ? re['b71'].join(',') : '',
        'b81': typeof re['b81'] !== 'undefined' ? re['b81'].join(',') : '',
        'b91': typeof re['b91'] !== 'undefined' ? re['b91'].join(',') : '',
        'b101': typeof re['b101'] !== 'undefined' ? re['b101'].join(',') : '',
        'b111': typeof re['b111'] !== 'undefined' ? re['b111'].join(',') : '',
        'b121': typeof re['b121'] !== 'undefined' ? re['b121'].join(',') : '',
        'b143': typeof re['b143'] !== 'undefined' ? re['b143'].join(',') : '',
        'b153': typeof re['b153'] !== 'undefined' ? re['b153'].join(',') : '',
        'b161': typeof re['b161'] !== 'undefined' ? re['b161'].join(',') : '',
        'b201': typeof re['b201'] !== 'undefined' ? re['b201'].join(',') : '',
        'b211': typeof re['b211'] !== 'undefined' ? re['b211'].format('YYYY-MM-DD') : ''
      }
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.zkbszl && this.zkbszl.zkbszlId) {
        re.zkbszlId = this.zkbszl.zkbszlId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      saveBasis(params)
        .then(res => {
          console.log(res)
          this.getFormData()
          that.$message.success(res.msg)
        })
        .catch(error => {
          console.log(error)
        })
      return false
    }
  }
}
</script>
<style lang="less" scoped>
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
}

.page-header-index-wide {
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 0;
  }

  /deep/ .tree-title {
    color: #25aefe;
    font-size: 20px;
    padding-left: 70px;
    padding-top: 18px;
    padding-bottom: 10px;
    background-image: url(../../../../assets/treeTop.png);
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

  /deep/ li.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open {
    background-color: rgba(245, 251, 255);

    .ant-menu.ant-menu-inline.ant-menu-sub {
      background-color: rgba(245, 251, 255);

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

    padding: 20px;

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

    /deep/ .label-overflow .ant-form-item-label{
      line-height: 20px;
      position: relative;
      top: 18px;
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
</style>