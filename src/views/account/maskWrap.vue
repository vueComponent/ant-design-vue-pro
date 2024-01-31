<template>
<div>
<a-form :form="form" @submit="handleSubmit">
     <div style="overflow: hidden;">
       <a-button class="btn fr" v-if="patientBasis.type === 3" @click="_import">导入</a-button>
       <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
       <a-button class="btn fr" @click="save">保存</a-button>
     </div>
  <div class="baselineForm" :style="baselineFormStyle" v-if="maskId === 1">
    <div class="title">1.基本病史</div>
    <a-form-item label="(1) 留全血:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['a_1', require1]">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(2) 留血清:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['a_2', require1]">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(3) 患者支扩确诊时间:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-date-picker placeholder="请选择" @change="changeDate" :disabled-date="disabledDate" v-decorator="['a_3', dateRequire]" style="width: 200px;"></a-date-picker>
    </a-form-item>
    <a-form-item label="(4) 主要临床症状（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-checkbox-group v-decorator="['a_4', selectRequired]">
        <a-checkbox value="1">咳嗽</a-checkbox>
        <a-checkbox value="2" :checked="controlList[maskId].control_a_4_1" @change="changeSelect($event, 'control_a_4_1')">咳痰</a-checkbox>
        <a-checkbox value="3">痰血</a-checkbox>
        <a-checkbox value="4" :checked="controlList[maskId].control_a_4_2" @change="changeSelect($event, 'control_a_4_2')">咯血</a-checkbox>
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
    <a-form-item label="痰量" v-if="controlList[maskId].control_a_4_1" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input addonAfter="ml/日" style="width: 200px;" v-decorator="['a_4_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="咯血量(最多)" v-if="controlList[maskId].control_a_4_2" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input addonAfter="ml/日" style="width: 200px;" v-decorator="['a_4_2', inputRequired]"></a-input>
    </a-form-item>
    <div class="title">2.既往病史</div>
    <a-form-item label="(1) 过去一年的急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input addonAfter="次" style="width: 200px;" v-decorator="['b_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(2) 过去一年的住院急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input addonAfter="次" style="width: 200px;" v-decorator="['b_2', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(3) 过去一年的门诊急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input addonAfter="次" style="width: 200px;" v-decorator="['b_3', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(4) 过去一年的门诊急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_4', dateRequire]"></a-date-picker>
    </a-form-item>
    <a-form-item label="(5) 有无病因相关的病史及事件（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-checkbox-group v-decorator="['b_5', selectRequired]">
        <a-checkbox value="1" :disabled="detect('b_5', '7')">既往有无麻疹</a-checkbox>
        <a-checkbox value="2" :disabled="detect('b_5', '7')">百日咳</a-checkbox>
        <a-checkbox value="3" :disabled="detect('b_5', '7')">肺结核</a-checkbox>
        <a-checkbox value="4" :disabled="detect('b_5', '7')">NTM</a-checkbox>
        <a-checkbox value="5" :disabled="detect('b_5', '7')">溺水</a-checkbox>
        <a-checkbox value="6" :disabled="detect('b_5', '7')">其他</a-checkbox>
        <a-checkbox value="7" @change="handleNone($event, 'b_5', '7')">无</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="(6) 目前合并呼吸系统相关疾病:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-checkbox-group v-decorator="['b_6', selectRequired]">
        <a-checkbox value="1" :checked="controlList[maskId].control_b_6_1" @change="changeSelect($event, 'control_b_6_1')">鼻炎</a-checkbox>
        <a-checkbox value="2" :checked="controlList[maskId].control_b_6_2" @change="changeSelect($event, 'control_b_6_2')">鼻窦炎</a-checkbox>
        <a-checkbox value="3" :checked="controlList[maskId].control_b_6_3" @change="changeSelect($event, 'control_b_6_3')">鼻息肉</a-checkbox>
        <a-checkbox value="4" :checked="controlList[maskId].control_b_6_4" @change="changeSelect($event, 'control_b_6_4')">哮喘</a-checkbox>
        <a-checkbox value="5" :checked="controlList[maskId].control_b_6_5" @change="changeSelect($event, 'control_b_6_5')">慢阻肺</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="鼻炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_6_1">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_1']"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="鼻窦炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_6_2">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_2']"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="鼻息肉具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_6_3">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_3']"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="哮喘具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_6_4">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_4']"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="慢阻肺具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_6_5">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_5']"></a-date-picker>
    </a-form-item>
    <a-form-item label="(7) 心血管系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_7', require2]" @change="changeRadio($event, 'control_b_7')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="心血管系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_7">
      <a-checkbox-group v-decorator="['b_7_1', selectRequired]">
        <a-checkbox value="1">心梗</a-checkbox>
        <a-checkbox value="2">心绞痛</a-checkbox>
        <a-checkbox value="3">冠心病</a-checkbox>
        <a-checkbox value="4">慢性心衰</a-checkbox>
        <a-checkbox value="5">心律失常</a-checkbox>
        <a-checkbox value="6">心脏瓣膜病</a-checkbox>
        <a-checkbox value="7">肺动脉高压</a-checkbox>
        <a-checkbox value="8">中风或短暂性缺血发作</a-checkbox>
        <a-checkbox value="9">外周血管疾病</a-checkbox>
        <a-checkbox value="10" :checked="controlList[maskId].control_b_7_2" @change="changeSelect($event, 'control_b_7_2')">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_7_2">
      <a-input style="width: 200px;" v-decorator="['b_7_2', dateRequire]"></a-input>
    </a-form-item>
    <a-form-item label="(8) 消化系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_8', require2]" @change="changeRadio($event, 'control_b_8')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="消化系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_8">
      <a-checkbox-group v-decorator="['b_8_1', selectRequired]">
        <a-checkbox value="1" :checked="controlList[maskId].control_b_8_1_1" @change="changeSelect($event, 'control_b_8_1_1')">炎性肠病</a-checkbox>
        <a-checkbox value="2">胃食管反流</a-checkbox>
        <a-checkbox value="3">消化道溃疡</a-checkbox>
        <a-checkbox value="4">慢性肝病</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="炎性肠病" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_8_1_1">
      <a-radio-group v-decorator="['b_8_1_1', require2]">
        <a-radio value="1">溃疡性结肠炎</a-radio>
        <a-radio value="2">克罗恩病</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(9) 内分泌系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_9', require2]" @change="changeRadio($event, 'control_b_9')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="内分泌系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_9">
      <a-checkbox-group v-decorator="['b_9_1', selectRequired]">
        <a-checkbox value="1" :checked="controlList[maskId].control_b_9_1_1" @change="changeSelect($event, 'control_b_9_1_1')">糖尿病</a-checkbox>
        <a-checkbox value="2">骨质疏松</a-checkbox>
        <a-checkbox value="3">高脂血症</a-checkbox>
        <a-checkbox value="4">甲亢</a-checkbox>
        <a-checkbox value="5">甲减</a-checkbox>
        <a-checkbox value="6">高尿酸血症</a-checkbox>
        <a-checkbox value="7">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="糖尿病" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_9_1_1">
      <a-radio-group v-decorator="['b_9_1_1', require2]">
        <a-radio value="1">I型</a-radio>
        <a-radio value="2">II型</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(10) 血液系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_10', require2]" @change="changeRadio($event, 'control_b_10')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="血液系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_10">
      <a-checkbox-group v-decorator="['b_10_1', selectRequired]">
        <a-checkbox value="1" :checked="controlList[maskId].control_b_10_1_1" @change="changeSelect($event, 'control_b_10_1_1')">缺铁性贫血</a-checkbox>
        <a-checkbox value="2">白血病</a-checkbox>
        <a-checkbox value="3">淋巴瘤</a-checkbox>
        <a-checkbox value="4">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="缺铁性贫血" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_10_1_1">
      <a-radio-group v-decorator="['b_10_1_1', require2]">
        <a-radio value="1">I型</a-radio>
        <a-radio value="2">II型</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(11) 泌尿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_11', require2]" @change="changeRadio($event, 'control_b_11')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="泌尿系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_11">
      <a-checkbox-group v-decorator="['b_11_1', selectRequired]">
        <a-checkbox value="1" :checked="controlList[maskId].control_b_11_1_1" @change="changeSelect($event, 'control_b_11_1_1')">慢性肾病</a-checkbox>
        <a-checkbox value="2">慢性尿路感染</a-checkbox>
        <a-checkbox value="3">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="慢性肾病" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_11_1_1">
      <a-checkbox v-decorator="['b_11_1_1']">有透析</a-checkbox>
    </a-form-item>
    <a-form-item label="(12) 风湿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_12', require2]" @change="changeRadio($event, 'control_b_12')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="风湿系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_12">
      <a-checkbox-group v-decorator="['b_12_1', selectRequired]">
        <a-checkbox value="1">系统性红斑狼疮</a-checkbox>
        <a-checkbox value="2">干燥综合征</a-checkbox>
        <a-checkbox value="3">系统性硬化</a-checkbox>
        <a-checkbox value="4">皮肌炎</a-checkbox>
        <a-checkbox value="5">先天性结缔组织发育不全病</a-checkbox>
        <a-checkbox value="6">青少年特发性关节炎</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="(13) 是否有HIV" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_13', require1]">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(14) 是否有恶性肿瘤" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_14', require1]" @change="changeRadio($event, 'control_b_14')">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <div v-if="controlList[maskId].control_b_14">
      <a-form-item class="border-dotted" label="当前正患病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-radio-group v-decorator="['b_14_1', require1]">
          <a-radio value="1">是</a-radio>
          <a-radio value="-1">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item class="border-dotted" label="血液性" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-radio-group v-decorator="['b_14_2', require1]">
          <a-radio value="1">是</a-radio>
          <a-radio value="-1">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item class="border-dotted" label="肿瘤部位(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-checkbox-group v-decorator="['b_14_3', selectRequired]">
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
      <a-radio-group v-decorator="['b_15', require2]" @change="changeRadio($event, 'control_b_15')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <div v-if="controlList[maskId].control_b_15">
      <a-form-item class="border-dotted" label="B细胞缺陷类疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-input style="width: 200px;" v-decorator="['b_15_1', inputRequired]"></a-input>
      </a-form-item>
      <a-form-item class="border-dotted" label="T细胞及联合免疫缺陷病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-input style="width: 200px;" v-decorator="['b_15_2', inputRequired]"></a-input>
      </a-form-item>
      <a-form-item class="border-dotted" label="继发性免疫缺陷(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-checkbox-group v-decorator="['b_15_3', selectRequired]">
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
        <a-input style="width: 200px;" v-decorator="['b_15_4', inputRequired]"></a-input>
      </a-form-item>
      <a-form-item class="border-dotted" label="补体缺陷疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
        <a-input style="width: 200px;" v-decorator="['b_15_5', inputRequired]"></a-input>
      </a-form-item>
    </div>
    <a-form-item label="(16) 其他疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_16', require2]" @change="changeRadio($event, 'control_b_16')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlList[maskId].control_b_16">
      <a-checkbox-group v-decorator="['b_16_1', selectRequired]">
        <a-checkbox value="1">抑郁</a-checkbox>
        <a-checkbox value="2">焦虑</a-checkbox>
        <a-checkbox value="3">认知功能障碍</a-checkbox>
        <a-checkbox value="4">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="(17) 其他系统相关治疗" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
    </a-form-item>
    <a-form-item label="调脂" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
      <a-radio-group v-decorator="['b_17_1', require1]" @change="changeRadio($event, 'control_b_17_1')">
          <a-radio value="1">是</a-radio>
          <a-radio value="-1">否</a-radio>
        </a-radio-group>
    </a-form-item>
    <a-row v-if="controlList[maskId].control_b_17_1">
      <a-col :span="18" :push="6">
        <a-form-item label="他汀类" :labelCol="labelColHor" :wrapperCol="wrapper18" class="border-dotted">
            <a-radio-group v-decorator="['b_17_1_1', require1]">
              <a-radio value="1">是</a-radio>
              <a-radio value="-1">否</a-radio>
            </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="抗凝" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
      <a-radio-group v-decorator="['b_17_2', require1]" @change="changeRadio($event, 'control_b_17_2')">
          <a-radio value="1">是</a-radio>
          <a-radio value="-1">否</a-radio>
        </a-radio-group>
    </a-form-item>
    <a-row v-if="controlList[maskId].control_b_17_2">
      <a-col :span="18" :push="6">
        <a-form-item label="阿司匹林" :labelCol="labelColHor" :wrapperCol="wrapper18"  class="border-dotted">
            <a-radio-group v-decorator="['b_17_2_1', require1]">
              <a-radio value="1">是</a-radio>
              <a-radio value="-1">否</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="非阿司匹林抑制剂（如：氯吡格雷）" :labelCol="labelColHor" :wrapperCol="wrapper18"  class="border-dotted">
            <a-radio-group v-decorator="['b_17_2_2', require1]">
              <a-radio value="1">是</a-radio>
              <a-radio value="-1">否</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="华法林/口服抗凝药" :labelCol="labelColHor" :wrapperCol="wrapper18"  class="border-dotted">
            <a-radio-group v-decorator="['b_17_2_3', require1]">
              <a-radio value="1">是</a-radio>
              <a-radio value="-1">否</a-radio>
            </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="(18) 家族史" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
    </a-form-item>
    <a-form-item label="是否近亲结婚史" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
      <a-radio-group v-decorator="['b_18_1', require1]">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="既往直系亲属有无支扩" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
      <a-radio-group v-decorator="['b_18_2', require1]">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="遗传性疾病病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_18_3', require1]" @change="changeRadio($event, 'control_b_18_3_1')">
        <a-radio value="1">是</a-radio>
        <a-radio value="-1">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="具体疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlList[maskId].control_b_18_3_1">
      <a-input style="width: 200px;" v-decorator="['b_18_3_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(19) 吸烟史(单选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_19', selectRequired]" @change="changeRadio($event, 'control_b_19_1')">
        <a-radio value="1">既往吸烟</a-radio>
        <a-radio value="2">已戒烟</a-radio>
        <a-radio value="3">无吸烟</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="吸烟指数" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlList[maskId].control_b_19_1">
      <a-input addonAfter="包/年" style="width: 200px;" v-decorator="['b_19_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(20) 胸部手术病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_20', require2]" @change="changeRadio($event, 'control_b_20')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="手术类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlList[maskId].control_b_20">
      <a-checkbox-group v-decorator="['b_20_1', selectRequired]">
        <a-checkbox value="1" :checked="controlList[maskId].control_b_20_2" @change="changeSelect($event, 'control_b_20_2')">肺叶切除术</a-checkbox>
        <a-checkbox value="2">胸膜剥脱术</a-checkbox>
        <a-checkbox value="3">肺减容术</a-checkbox>
        <a-checkbox value="4">胸腔闭式引流</a-checkbox>
        <a-checkbox value="5">冠脉搭桥术</a-checkbox>
        <a-checkbox value="6">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="肺叶切除术" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlList[maskId].control_b_20_2">
      <a-radio-group v-decorator="['b_20_2', require2]">
        <a-radio value="1">I型</a-radio>
        <a-radio value="2">II型</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="(21) 支气管动脉栓塞病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_21', require2]" @change="changeRadio($event, 'control_b_21')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <div v-if="controlList[maskId].control_b_21">
      <a-form-item label="若行支气管动脉栓塞术：时间" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
        <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_21_1', dateRequire]"></a-date-picker>
      </a-form-item>
      <a-form-item label="支气管动脉栓塞术部位" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
        <a-input style="width: 200px;" v-decorator="['b_21_2', inputRequired]"></a-input>
      </a-form-item>
    </div>
 </div>
 <div class="baselineForm" :style="baselineFormStyle" v-if="maskId === 2">
 	<div class="title">1.体格检查</div>
    <a-form-item label="(1) T:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_1', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(2) BP:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_2', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(3) R:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_3', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(4) HR:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_4', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(5) SpO2:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_5', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(6) 身高:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_6', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(7) 体重:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_7', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(8) BMI(自动演算出):" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input v-decorator="['a_8', inputRequired]" style="width: 200px;"></a-input>
    </a-form-item>
    <a-form-item label="(9) 肺部体征：双肺呼吸音:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
    </a-form-item>
    <a-form-item label="啰音" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
      <a-radio-group v-decorator="['a_9', require2]" @change="changeRadio($event, 'control_a_9')">
          <a-radio value="1">有</a-radio>
          <a-radio value="-1">无</a-radio>
        </a-radio-group>
    </a-form-item>
    <div v-if="controlList[maskId].control_a_9">
    	<a-form-item label="啰音类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
      		<a-radio-group v-decorator="['a_9_1', selectRequired]">
	          <a-radio value="1">湿罗音</a-radio>
	          <a-radio value="2">干啰音</a-radio>
	        </a-radio-group>
	    </a-form-item>
	    <a-form-item label="啰音部位" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
	    	<a-input style="width: 200px;" v-decorator="['a_9_2', inputRequired]"></a-input>
	    </a-form-item>
    </div>
 </div>
 <div class="baselineForm" :style="baselineFormStyle" v-if="maskId === 3">
 	
 </div>
 </a-form>
</div>
</template>
<script>
export default{
	props: {
	    maskId: {
	      type: Number,
	      required: true
	    }
  	},
  	data() {
  		return {
			baselineInfoStyle: {
				overflow:"auto",
				height:(window.screen.height-330)+'px',
				"padding-right":"0px",
				"border-right":"1px solid #ddd"
			},
			baselineFormStyle:{
	        	height:(window.screen.height-350)+'px',
	      	},
	      	form: this.$form.createForm(this),
	      	controlList: {
	      		/** 支扩病史资料 */
	      		1: {
	      			control_a_4_1: false,
					control_a_4_2: false,
					control_b_6_1: false,
					control_b_6_2: false,
					control_b_6_3: false,
					control_b_6_4: false,
					control_b_6_5: false,
					control_b_7: false,
					control_b_7_2: false,
					control_b_8: false,
					control_b_8_1_1: false,
					control_b_9: false,
					control_b_9_1_1: false,
					control_b_10: false,
					control_b_10_1_1: false,
					control_b_11: false,
					control_b_11_1_1: false,
					control_b_12: false,
					control_b_14: false,
					control_b_15: false,
					control_b_16: false,
					control_b_17_1: false,
					control_b_17_2: false,
					control_b_18_3_1: false,
					control_b_19_1: false,
					control_b_20: false,
					control_b_20_2: false,
					control_b_21: false
	      		},
	      		/** 体格检查 */
	      		2: {
	      			control_a_9: false
	      		}
	      	},
			labelColHor: {
				xs: { span: 24 },
				sm: { span: 6 },
				md: { span: 6}
			},
			wrapper18: {
				md: { span: 18 }
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
			dateRequire: {
				rules: [{type: 'object', required: true, message: '请选择时间！'}]
			},
			require1: {
				rules: [{required: true, message: '请选择是或否！'}]
			},
			require2: {
				rules: [{required: true, message: '请选择有或无！'}]
			},
			selectRequired: {
				rules: [{required: true, message: '请选择！'}]
			},
			inputRequired: {
				rules: [{required: true, message: '请填写！'}]
			}
  		}
  	},
  	methods: {
      getBirthdayByIdNO (IdNO){
        let birthday = "";
        if (IdNO.length==18) {
          birthday = IdNO.substr(6,8);
          return birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        }else if(IdNO.length==15){
          birthday = "19"+IdNO.substr(6,6);
          return birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        }else{
          return "";
        }
      },
      disabledDate(current) {
        let date = this.getBirthdayByIdNO(this.patient.card)
        return current && current > moment().endOf('day') || moment(date).endOf('day') > current;
      },
      handleNone(e, d, v, arr) {
        if(e.target.checked){
          let data = {}
          data[d] = [v]
          this.$nextTick(() => {
            this.form.setFieldsValue(data)
            arr.forEach((t) => {
              this[t] = false
            })
          })
        }
      },
      detect(d, v) {
        if(Array.isArray(this.form.getFieldValue(d)) && this.form.getFieldValue(d).indexOf(v) > -1) {
          return true
        } else {
          return false
        }
      },
      changeDate(date) {
        let timeDiff = Math.abs(new Date(date._d) - new Date(this.getBirthdayByIdNO(this.patient.card)));
        // 将毫秒数转换为年数
        let yearDiff = timeDiff / (1000 * 3600 * 24 * 365.25); // 考虑闰年
        // 判断年数是否大于 10 年
        if (yearDiff < 10) {
          this.$message.warning('是否为儿童确诊支扩');
        }
      },
  		changeSelect(e, t) {
	      this.controlList[this.maskId][t] = e.target.checked
	    },
	    changeRadio(e, t) {
	      if(t === 'control_b_19_1' && this.maskId === 1){
	        if(e.target.value === '1' || e.target.value === '2'){
	          this.controlList[this.maskId][t] = true
	        }else{
	          this.controlList[this.maskId][t] = false
	        }
	      }else if(e.target.value === '1'){
	        this.controlList[this.maskId][t] = true
	      }else{
	        this.controlList[this.maskId][t] = false
	      }
	    },
	    handleSubmit() {
	    	
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
  .baselineForm {
    overflow: auto;
    .title{
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
      &.no-border{
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }
      &:hover {
      }
      &.border-dotted{
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
    /deep/ .ant-form-item-control-wrapper .ant-form-item-control{
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
</style>									