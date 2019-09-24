<template>
  <div class="baselineForm" :style="baselineFormStyle" slot="mask-1">
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
      <a-date-picker placeholder="请选择" v-decorator="['a_3', dateRequire]"></a-date-picker style="width: 200px;">
    </a-form-item>
    <a-form-item label="(4) 主要临床症状（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-checkbox-group v-decorator="['a_4', selectRequired]">
        <a-checkbox value="1">咳嗽</a-checkbox>
        <a-checkbox value="2" :checked="control_a_4_1" @change="changeSelect($event, 'control_a_4_1')">咳痰</a-checkbox>
        <a-checkbox value="3">痰血</a-checkbox>
        <a-checkbox value="4" :checked="control_a_4_2" @change="changeSelect($event, 'control_a_4_2')">咯血</a-checkbox>
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
    <a-form-item label="痰量" v-if="control_a_4_1" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-input addonAfter="ml/日" style="width: 200px;" v-decorator="['a_4_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="咯血量(最多)" v-if="control_a_4_2" :labelCol="labelColHor" :wrapperCol="wrapperHor">
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
    <a-form-item label="(5) 有无以下疾病及事件（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-checkbox-group v-decorator="['b_5', selectRequired]">
        <a-checkbox value="1">既往有无麻疹</a-checkbox>
        <a-checkbox value="2">百日咳</a-checkbox>
        <a-checkbox value="3">肺结核</a-checkbox>
        <a-checkbox value="4">NTM</a-checkbox>
        <a-checkbox value="5">溺水</a-checkbox>
        <a-checkbox value="6">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="(6) 目前合并呼吸系统相关疾病:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-checkbox-group v-decorator="['b_6', selectRequired]">
        <a-checkbox value="1" :checked="control_b_6_1" @change="changeSelect($event, 'control_b_6_1')">鼻炎</a-checkbox>
        <a-checkbox value="2" :checked="control_b_6_2" @change="changeSelect($event, 'control_b_6_2')">鼻窦炎</a-checkbox>
        <a-checkbox value="3" :checked="control_b_6_3" @change="changeSelect($event, 'control_b_6_3')">鼻息肉</a-checkbox>
        <a-checkbox value="4" :checked="control_b_6_4" @change="changeSelect($event, 'control_b_6_4')">哮喘</a-checkbox>
        <a-checkbox value="5" :checked="control_b_6_5" @change="changeSelect($event, 'control_b_6_5')">慢阻肺</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="鼻炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_6_1">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_1', dateRequire]"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="鼻窦炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_6_2">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_2', dateRequire]"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="鼻息肉具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_6_3">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_3', dateRequire]"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="哮喘具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_6_4">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_4', dateRequire]"></a-date-picker>
    </a-form-item>
    <a-form-item class="no-border" label="慢阻肺具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_6_5">
      <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_6_5', dateRequire]"></a-date-picker>
    </a-form-item>
    <a-form-item label="(7) 心血管系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_7', require2]" @change="changeRadio($event, 'control_b_7')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="心血管系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_7">
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
        <a-checkbox value="10" :checked="control_b_7_2" @change="changeSelect($event, 'control_b_7_2')">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_7_2">
      <a-input style="width: 200px;" v-decorator="['b_7_2', dateRequire]"></a-input>
    </a-form-item>
    <a-form-item label="(8) 消化系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_8', require2]" @change="changeRadio($event, 'control_b_8')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="消化系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_8">
      <a-checkbox-group v-decorator="['b_8_1', selectRequired]">
        <a-checkbox value="1" :checked="control_b_8_1_1" @change="changeSelect($event, 'control_b_8_1_1')">炎性肠病</a-checkbox>
        <a-checkbox value="2">胃食管反流</a-checkbox>
        <a-checkbox value="3">消化道溃疡</a-checkbox>
        <a-checkbox value="4">慢性肝病</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="炎性肠病" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_8_1_1">
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
    <a-form-item class="no-border" label="内分泌系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_9">
      <a-checkbox-group v-decorator="['b_9_1', selectRequired]">
        <a-checkbox value="1" :checked="control_b_9_1_1" @change="changeSelect($event, 'control_b_9_1_1')">糖尿病</a-checkbox>
        <a-checkbox value="2">骨质疏松</a-checkbox>
        <a-checkbox value="3">高脂血症</a-checkbox>
        <a-checkbox value="4">甲亢</a-checkbox>
        <a-checkbox value="5">甲减</a-checkbox>
        <a-checkbox value="6">高尿酸血症</a-checkbox>
        <a-checkbox value="7">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="糖尿病" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_9_1_1">
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
    <a-form-item class="no-border" label="血液系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_10">
      <a-checkbox-group v-decorator="['b_10_1', selectRequired]">
        <a-checkbox value="1" :checked="control_b_10_1_1" @change="changeSelect($event, 'control_b_10_1_1')">缺铁性贫血</a-checkbox>
        <a-checkbox value="2">白血病</a-checkbox>
        <a-checkbox value="3">淋巴瘤</a-checkbox>
        <a-checkbox value="4">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="缺铁性贫血" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_10_1_1">
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
    <a-form-item class="no-border" label="泌尿系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_11">
      <a-checkbox-group v-decorator="['b_11_1', selectRequired]">
        <a-checkbox value="1" :checked="control_b_11_1_1" @change="changeSelect($event, 'control_b_11_1_1')">慢性肾病</a-checkbox>
        <a-checkbox value="2">慢性尿路感染</a-checkbox>
        <a-checkbox value="3">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="no-border" label="慢性肾病" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_11_1_1">
      <a-checkbox v-decorator="['b_11_1_1']">有透析</a-checkbox>
    </a-form-item>
    <a-form-item label="(12) 风湿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_12', require2]" @change="changeRadio($event, 'control_b_12')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item class="no-border" label="风湿系统疾病类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_12">
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
    <div v-if="control_b_14">
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
    <div v-if="control_b_15">
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
    <a-form-item label="疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="control_b_16">
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
    <a-row v-if="control_b_17_1">
      <a-col :span="18" :push="6">
        <a-form-item label="他汀类" :labelCol="labelColHor" :wrapperCol="wrapper18"class="border-dotted">
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
    <a-row v-if="control_b_17_2">
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
    <a-form-item label="具体疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="control_b_18_3_1">
      <a-input style="width: 200px;" v-decorator="['b_18_3_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(19) 吸烟史(单选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_19', selectRequired]" @change="changeRadio($event, 'control_b_19_1')">
        <a-radio value="1">既往吸烟</a-radio>
        <a-radio value="2">已戒烟</a-radio>
        <a-radio value="3">无吸烟</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="吸烟指数" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="control_b_19_1">
      <a-input addonAfter="包/年" style="width: 200px;" v-decorator="['b_19_1', inputRequired]"></a-input>
    </a-form-item>
    <a-form-item label="(20) 胸部手术病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
      <a-radio-group v-decorator="['b_20', require2]" @change="changeRadio($event, 'control_b_20')">
        <a-radio value="1">有</a-radio>
        <a-radio value="-1">无</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="手术类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="control_b_20">
      <a-checkbox-group v-decorator="['b_20_1', selectRequired]">
        <a-checkbox value="1" :checked="control_b_20_2" @change="changeSelect($event, 'control_b_20_2')">肺叶切除术</a-checkbox>
        <a-checkbox value="2">胸膜剥脱术</a-checkbox>
        <a-checkbox value="3">肺减容术</a-checkbox>
        <a-checkbox value="4">胸腔闭式引流</a-checkbox>
        <a-checkbox value="5">冠脉搭桥术</a-checkbox>
        <a-checkbox value="6">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="肺叶切除术" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="control_b_20_2">
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
    <div v-if="control_b_21">
      <a-form-item label="若行支气管动脉栓塞术：时间" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
        <a-date-picker placeholder="请选择" style="width: 200px;" v-decorator="['b_21_1', dateRequire]"></a-date-picker>
      </a-form-item>
      <a-form-item label="支气管动脉栓塞术部位" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
        <a-input style="width: 200px;" v-decorator="['b_21_2', inputRequired]"></a-input>
      </a-form-item>
    </div>
 </div>
</template>