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
          <a-form :form="form" @submit="handleSubmit" class="base-form" :layout="formLayout">
            <div class="btn-array" v-if="executeStatus !== 2 && canEdit">
              <a-button class="btn fr" type="primary" html-type="submit" ref="submitBtn">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2 && canEdit">
              <a-button class="btn fr" type="primary" @click="withdraw">撤回</a-button>
            </div>

            <div class="baselineForm" :style="baselineFormStyle">
              <div class="title">1.基本病史</div>
              <a-form-item label="(1) 采集标本类型" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['a1', {...selectRequired, initialValue: initValue('a1', 'array')}]">
                  <a-checkbox value="1">全血</a-checkbox>
                  <a-checkbox value="2">血清</a-checkbox>
                  <a-checkbox value="3">未采</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="(2) 患者支扩确诊时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-month-picker placeholder="请选择" v-decorator="['a3', {...dateRequire, initialValue: initValue('a3', 'time')}]" :disabledDate="disabledDate" style="width: 240px;"></a-month-picker>
              </a-form-item>
              <a-form-item label="(3) 访视类型" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b23', {...selectRequired, initialValue: initValue('b23')}]">
                  <a-radio value="1">急性加重期</a-radio>
                  <a-radio value="2">稳定期</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(4) 主要临床症状（多选）" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['a4', {...selectRequired, initialValue: initValue('a4', 'array')}]" class="control-m-line">
                  <a-checkbox value="1">咳嗽</a-checkbox>
                  <a-checkbox value="2" :checked="controla41" @change="changeSelect($event, 'controla41')">咳痰</a-checkbox>
                  <a-checkbox value="3" :checked="controla43" @change="changeSelect($event, 'controla43')">痰血</a-checkbox>
                  <a-checkbox value="4" :checked="controla42" @change="changeSelect($event, 'controla42')">咯血</a-checkbox>
                  <a-checkbox value="5">胸闷</a-checkbox>
                  <a-checkbox value="6">喘息</a-checkbox>
                  <a-checkbox value="7">活动后气促</a-checkbox>
                  <a-checkbox value="8">胸痛</a-checkbox>
                  <a-checkbox value="9">发热</a-checkbox>
                  <a-checkbox value="10">全身疲乏</a-checkbox>
                  <a-checkbox value="11">纳差</a-checkbox>
                  <a-checkbox value="12">消瘦</a-checkbox>
                  <a-checkbox value="13" :checked="controla413" @change="changeSelect($event, 'controla413')">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="痰量" v-if="controla41" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['a41', {...inputRequired, initialValue: initValue('a41')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="痰液粘稠Murry评分（单选）" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controla41">
                <a-popover>
                  <template slot="content">
                    <img src="../../../assets/murry.png" style="height: 260px;" />
                  </template>
                  <a-icon type="exclamation-circle" style="position: relative;left: -20px;color: #0399ec;cursor: pointer;" />
                </a-popover>
                <a-radio-group v-decorator="['a43', {...selectRequired, initialValue: initValue('a43')}]">
                  <a-radio value="1">粘液性</a-radio>
                  <a-radio value="2">黏脓性</a-radio>
                  <a-radio value="3">脓性</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="痰血量" v-if="controla43" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['todo', {...inputRequired, initialValue: initValue('todo')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="咯血量(最多)" v-if="controla42" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['a42', {...inputRequired, initialValue: initValue('a42')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="其他症状" v-if="controla413" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a45', {...inputRequired, initialValue: initValue('a45')}]" autocomplete="off"></a-input>
              </a-form-item>
              <div class="title">2.既往病史</div>
              <a-form-item label="(1) 过去两年的住院急性加重次数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="次" style="width: 240px;" v-decorator="['b2', {...inputRequired, initialValue: initValue('b2')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(2) 过去一年的住院急性加重次数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="次" style="width: 240px;" v-decorator="['b3', {...inputRequired, initialValue: initValue('b3')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(3) 过去一年的急性加重次数" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input addonAfter="次" style="width: 240px;" v-decorator="['b1', {...inputRequired, initialValue: initValue('b1')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(4) 最后一次因急性加重住院的时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" :disabledDate="disabledDate" v-decorator="['b4', { initialValue: initValue('b4', 'time')}]"></a-date-picker>
              </a-form-item>
              <a-form-item label="(5) 有无以下疾病及事件（多选）" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-checkbox-group v-decorator="['b5', {...selectRequired, initialValue: initValue('b5', 'array')}]">
                  <a-checkbox value="1">麻疹</a-checkbox>
                  <a-checkbox value="2">百日咳</a-checkbox>
                  <a-checkbox value="3">肺结核</a-checkbox>
                  <a-checkbox value="4">NTM</a-checkbox>
                  <a-checkbox value="5">溺水</a-checkbox>
                  <a-checkbox value="6" :checked="controlb51" @change="changeSelect($event, 'controlb51')">其他</a-checkbox>
                  <a-checkbox value="7">无</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb51">
                <a-input style="width: 240px;" v-decorator="['b51', {...inputRequired, initialValue: initValue('b51')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(6) 目前合并呼吸系统相关疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['b6', {...selectRequired, initialValue: initValue('b6', 'array')}]">
                  <a-checkbox value="1" :checked="controlb61" @change="changeSelect($event, 'controlb61')">鼻炎</a-checkbox>
                  <a-checkbox value="2" :checked="controlb62" @change="changeSelect($event, 'controlb62')">鼻窦炎</a-checkbox>
                  <a-checkbox value="3" :checked="controlb63" @change="changeSelect($event, 'controlb63')">鼻息肉</a-checkbox>
                  <a-checkbox value="4" :checked="controlb64" @change="changeSelect($event, 'controlb64')">哮喘</a-checkbox>
                  <a-checkbox value="5" :checked="controlb65" @change="changeSelect($event, 'controlb65')">慢阻肺</a-checkbox>
                  <a-checkbox value="6" :checked="controlb66" @change="changeSelect($event, 'controlb66')">无</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="鼻炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb61">
                <a-month-picker placeholder="请选择" style="width: 240px;" v-decorator="['b61', {...dateRequire, initialValue: initValue('b61', 'time')}]" :disabledDate="disabledDate"></a-month-picker>
              </a-form-item>
              <a-form-item class="no-border" label="鼻窦炎具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb62">
                <a-month-picker placeholder="请选择" style="width: 240px;" v-decorator="['b62', {...dateRequire, initialValue: initValue('b62', 'time')}]" :disabledDate="disabledDate"></a-month-picker>
              </a-form-item>
              <a-form-item class="no-border" label="鼻息肉具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb63">
                <a-month-picker placeholder="请选择" style="width: 240px;" v-decorator="['b63', {...dateRequire, initialValue: initValue('b63', 'time')}]" :disabledDate="disabledDate"></a-month-picker>
              </a-form-item>
              <a-form-item class="no-border" label="哮喘具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb64">
                <a-month-picker placeholder="请选择" style="width: 240px;" v-decorator="['b64', {...dateRequire, initialValue: initValue('b64', 'time')}]" :disabledDate="disabledDate"></a-month-picker>
              </a-form-item>
              <a-form-item class="no-border" label="慢阻肺具体诊断日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb65">
                <a-month-picker placeholder="请选择" style="width: 240px;" v-decorator="['b65', {...dateRequire, initialValue: initValue('b65', 'time')}]" :disabledDate="disabledDate"></a-month-picker>
              </a-form-item>
              <a-form-item label="(7) 有无其他疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b70', {...require2, initialValue: initValue('b70')}]" @change="changeRadio($event, 'controlb70')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb70">
                <a-form-item label="1.心脑血管系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b7', {...require2, initialValue: initValue('b7')}]" @change="changeRadio($event, 'controlb7')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="心脑血管系统疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb7">
                  <a-checkbox-group v-decorator="['b71', {...selectRequired, initialValue: initValue('b71', 'array')}]" class="control-m-line">
                    <a-checkbox value="1">心梗</a-checkbox>
                    <a-checkbox value="2">心绞痛</a-checkbox>
                    <a-checkbox value="3">冠心病</a-checkbox>
                    <a-checkbox value="4">慢性心衰</a-checkbox>
                    <a-checkbox value="5">心律失常</a-checkbox>
                    <a-checkbox value="6">心脏瓣膜病</a-checkbox>
                    <a-checkbox value="7">肺动脉高压</a-checkbox>
                    <a-checkbox value="8">高血压病</a-checkbox>
                    <a-checkbox value="9">中风或短暂性缺血发作</a-checkbox>
                    <a-checkbox value="10">外周血管疾病</a-checkbox>
                    <a-checkbox value="11" :checked="controlb72" @change="changeSelect($event, 'controlb72')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="no-border" label="其他心脑血管疾病" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb7 && controlb72">
                  <a-input style="width: 240px;" v-decorator="['b72', {...inputRequired, initialValue: initValue('b72')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="2.消化系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b8', {...require2, initialValue: initValue('b8')}]" @change="changeRadio($event, 'controlb8')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="消化系统疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb8">
                  <a-checkbox-group v-decorator="['b81', {...selectRequired, initialValue: initValue('b81', 'array')}]">
                    <a-checkbox value="1">炎症性肠病</a-checkbox>
                    <a-checkbox value="2">胃食管反流</a-checkbox>
                    <a-checkbox value="3">消化道溃疡</a-checkbox>
                    <a-checkbox value="4">慢性肝病</a-checkbox>
                    <a-checkbox value="5" :checked="controlb82" @change="changeSelect($event, 'controlb82')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="no-border" label="其他消化系统疾病" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb8 && controlb82">
                  <a-input style="width: 240px;" v-decorator="['b82', {...inputRequired, initialValue: initValue('b82')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="3.内分泌系统" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b9', {...require2, initialValue:  initValue('b9')}]" @change="changeRadio($event, 'controlb9')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="内分泌系统疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb9">
                  <a-checkbox-group v-decorator="['b91', {...selectRequired, initialValue: initValue('b91', 'array')}]">
                    <a-checkbox value="1">糖尿病</a-checkbox>
                    <a-checkbox value="2">骨质疏松</a-checkbox>
                    <a-checkbox value="3">高脂血症</a-checkbox>
                    <a-checkbox value="4">甲亢</a-checkbox>
                    <a-checkbox value="5">甲减</a-checkbox>
                    <a-checkbox value="6">高尿酸血症</a-checkbox>
                    <a-checkbox value="7" :checked="controlb917" @change="changeSelect($event, 'controlb917')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="其他内分泌系统疾病" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb9 && controlb917">
                  <a-input style="width: 240px;" v-decorator="['b92', {...inputRequired, initialValue: initValue('b92')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="4.血液系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b10', {...require2, initialValue: initValue('b10')}]" @change="changeRadio($event, 'controlb10')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="血液系统疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb10">
                  <a-checkbox-group v-decorator="['b101', {...selectRequired, initialValue: initValue('b101', 'array')}]">
                    <a-checkbox value="1">贫血</a-checkbox>
                    <a-checkbox value="2">白血病</a-checkbox>
                    <a-checkbox value="3">淋巴瘤</a-checkbox>
                    <a-checkbox value="4" :checked="controlb1014" @change="changeSelect($event, 'controlb1014')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="其他血液系统疾病类型" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb1014">
                  <a-input style="width: 240px;" v-decorator="['b102', {...inputRequired, initialValue: initValue('b102')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="5.泌尿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b11', {...require2, initialValue: initValue('b11')}]" @change="changeRadio($event, 'controlb11')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="泌尿系统疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb11">
                  <a-checkbox-group v-decorator="['b111', {...selectRequired, initialValue: initValue('b111', 'array')}]">
                    <a-checkbox value="1">慢性肾病</a-checkbox>
                    <a-checkbox value="2">慢性尿路感染</a-checkbox>
                    <a-checkbox value="3" :checked="controlb1113" @change="changeSelect($event, 'controlb1113')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="no-border" label="其他泌尿系统疾病类型:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb11 && controlb1113">
                  <a-input style="width: 240px;" v-decorator="['b112', {...inputRequired, initialValue: initValue('b112')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="6.风湿系统疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b12', {...require2, initialValue: initValue('b12')}]" @change="changeRadio($event, 'controlb12')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="no-border" label="风湿系统疾病类型" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb12">
                  <a-checkbox-group v-decorator="['b121', {...selectRequired, initialValue: initValue('b121', 'array')}]" class="control-m-line">
                    <a-checkbox value="1">系统性红斑狼疮</a-checkbox>
                    <a-checkbox value="2">类风湿性关节炎</a-checkbox>
                    <a-checkbox value="3">干燥综合征</a-checkbox>
                    <a-checkbox value="4">系统性硬化</a-checkbox>
                    <a-checkbox value="5">皮肌炎</a-checkbox>
                    <a-checkbox value="6" :checked="controlb122" @change="changeSelect($event, 'controlb122')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="no-border" label="其他风湿系统疾病类型:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb12 && controlb122">
                  <a-input style="width: 240px;" v-decorator="['b122', {...inputRequired, initialValue: initValue('b122')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="7.是否有HIV" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b13', {...require1, initialValue: initValue('b13')}]">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="8.是否有恶性肿瘤" :labelCol="labelColHor" :wrapperCol="wrapperHor">
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
                    <a-checkbox-group v-decorator="['b143', {...selectRequired, initialValue: initValue('b143', 'array')}]" class="control-m-line">
                      <a-checkbox value="1">头颈部</a-checkbox>
                      <a-checkbox value="2">肺</a-checkbox>
                      <a-checkbox value="3">乳腺</a-checkbox>
                      <a-checkbox value="4">胃肠道</a-checkbox>
                      <!-- <a-checkbox value="5">小肠</a-checkbox>
                      <a-checkbox value="6">结肠</a-checkbox> -->
                      <a-checkbox value="5">肝</a-checkbox>
                      <a-checkbox value="6">胰腺</a-checkbox>
                      <a-checkbox value="7">肾</a-checkbox>
                      <a-checkbox value="8">前列腺</a-checkbox>
                      <a-checkbox value="9">膀胱</a-checkbox>
                      <a-checkbox value="10">子宫及附件</a-checkbox>
                      <a-checkbox value="11">骨</a-checkbox>
                      <a-checkbox value="12">皮肤</a-checkbox>
                      <a-checkbox value="13">脑</a-checkbox>
                      <a-checkbox value="14" :checked="controlb144" @change="changeSelect($event, 'controlb144')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </div>
                <a-form-item class="no-border" label="其他肿瘤部位:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb14 && controlb144">
                  <a-input style="width: 240px;" v-decorator="['b144', {...inputRequired, initialValue: initValue('b144')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="9.免疫缺陷" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b15', {...require2, initialValue: '-1'}]" @change="changeRadio($event, 'controlb15')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb15">
                  <a-form-item class="border-dotted" label="B细胞缺陷类疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-input style="width: 240px;" v-decorator="['b151', {...inputRequired, initialValue: initValue('b151')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="T细胞及联合免疫缺陷病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-input style="width: 240px;" v-decorator="['b152', {...inputRequired, initialValue: initValue('b152')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="继发性免疫缺陷(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-checkbox-group v-decorator="['b153', {...selectRequired, initialValue: initValue('b153', 'array')}]" class="control-m-line">
                      <a-checkbox value="1">慢性淋巴性白血病</a-checkbox>
                      <a-checkbox value="2">多发性骨髓瘤</a-checkbox>
                      <a-checkbox value="3">血液肿瘤相关免疫缺陷</a-checkbox>
                      <a-checkbox value="4">系统化疗后免疫缺陷</a-checkbox>
                      <a-checkbox value="5">免疫抑制药物后免疫缺陷</a-checkbox>
                      <a-checkbox value="6">干细胞移植</a-checkbox>
                      <a-checkbox value="7">实体器官移植</a-checkbox>
                      <a-checkbox value="8" :checked="controlb1538" @change="changeSelect($event, 'controlb1538')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item class="no-border" label="其他继发性免疫缺陷:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb15 && controlb1538">
                    <a-input style="width: 240px;" v-decorator="['b1538', {...inputRequired, initialValue: initValue('b1538')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="巨噬细胞缺陷疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-input style="width: 240px;" v-decorator="['b154', {...inputRequired, initialValue: initValue('b154')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item class="border-dotted" label="补体缺陷疾病名称" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-input style="width: 240px;" v-decorator="['b155', {...inputRequired, initialValue: initValue('b155')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <a-form-item label="10.其他疾病" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b161', {...selectRequired, initialValue: initValue('b161', 'array')}]">
                    <a-checkbox value="1">无</a-checkbox>
                    <a-checkbox value="2">抑郁</a-checkbox>
                    <a-checkbox value="3">焦虑</a-checkbox>
                    <a-checkbox value="4">认知功能障碍</a-checkbox>
                    <a-checkbox value="5" :checked="controlb1615" @change="changeSelect($event, 'controlb1615')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="no-border" label="其他疾病类型:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb1615">
                  <a-input style="width: 240px;" v-decorator="['b1611', {...inputRequired, initialValue: initValue('b1611')}]" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(8) 其他系统相关治疗（非呼吸系统治疗）" :labelCol="wrapper18" class="border-dotted">
              </a-form-item>
              <a-form-item label="调脂" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-checkbox-group v-decorator="['b171', {...selectRequired, initialValue: initValue('b171', 'array')}]">
                  <a-checkbox value="1">他汀类</a-checkbox>
                  <a-checkbox value="2" :checked="controlb1711" @change="changeSelect($event, 'controlb1711')">其他</a-checkbox>
                  <a-checkbox value="3">无</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="其他调脂:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb1711">
                <a-input style="width: 240px;" v-decorator="['b1711', {...inputRequired, initialValue: initValue('b1711')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="抗凝(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-checkbox-group v-decorator="['b172', {...selectRequired, initialValue: initValue('b172', 'array')}]">
                  <a-checkbox value="1">阿司匹林</a-checkbox>
                  <a-checkbox value="2">非阿司匹林抑制剂（如：氯吡格雷）</a-checkbox>
                  <a-checkbox value="3">华法林/口服抗凝药</a-checkbox>         
                  <a-checkbox value="4" :checked="controlb1721" @change="changeSelect($event, 'controlb1721')">其他</a-checkbox>
                  <a-checkbox value="5">无</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item class="no-border" label="其他抗凝:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlb1721">
                <a-input style="width: 240px;" v-decorator="['b1721', {...inputRequired, initialValue: initValue('b1721')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(9) 家族史" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
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
                <a-input style="width: 240px;" v-decorator="['b1831', {...inputRequired, initialValue: initValue('b1831')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(10) 吸烟史(单选)" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b19', {...selectRequired, initialValue: initValue('b19')}]" @change="changeRadio($event, 'controlb191')">
                  <a-radio value="1">既往吸烟</a-radio>
                  <a-radio value="2">已戒烟</a-radio>
                  <a-radio value="3">无吸烟</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="吸烟指数" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlb191">
                <a-input addonAfter="包*年" style="width: 240px;" v-decorator="['b191', {...inputRequired, initialValue: initValue('b191')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(11) 职业粉尘接触及生物燃料接触史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b22', {...require2, initialValue: initValue('b22')}]">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="(12) 胸部手术病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b20', {...require2, initialValue: initValue('b20')}]" @change="changeRadio($event, 'controlb20')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="手术类型(多选)" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted" v-if="controlb20">
                <a-checkbox-group v-decorator="['b201', {...selectRequired, initialValue: initValue('b201', 'array')}]">
                  <a-checkbox value="1">肺叶切除术</a-checkbox>
                  <a-checkbox value="2">胸膜剥脱术</a-checkbox>
                  <a-checkbox value="3">肺减容术</a-checkbox>
                  <a-checkbox value="4">冠脉搭桥术</a-checkbox>
                  <a-checkbox value="5" :checked="controlb202" @change="changeSelect($event, 'controlb202')">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="其他手术名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset" class="border-dotted" v-if="controlb20 && controlb202">
                <a-input style="width: 240px;" v-decorator="['b202', {...inputRequired, initialValue: initValue('b202')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(13) 支气管动脉栓塞病史" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['b21', {...require2, initialValue: initValue('b21')}]" @change="changeRadio($event, 'controlb21')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb21">
                <a-form-item label="若行支气管动脉栓塞术时间" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b211', {...dateRequire, initialValue: initValue('b211', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="支气管动脉栓塞术部位" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-input style="width: 240px;" v-decorator="['b212', {...inputRequired, initialValue: initValue('b212')}]" autocomplete="off"></a-input>
                </a-form-item>
              </div>
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
import _ from 'lodash'
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm, recoverSubmit } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ContactForm from '@/views/account/ContactForm'
export default {
  name: 'task14',
  components: {
    STree,
    MyIcon,
    ContactForm
  },
  data() {
    return {
      formLayout: 'horizontal',
      markName: 'zkbszl',
      title: '年访视',
      openKeys: [],
      defaultSelectedKeys: [14],
      orgTree: [],
      patient: {},
      patientBasis: {},
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      clientHeight: '',
      contentHeight: '',
      baselineFormStyle: {
        // "height": "700px",
        "padding-top": "52px",
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
      labelColOffset2: {
        md: { span: 3, offset: 6 }
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
      controla43: false,
      controlb61: false,
      controlb51: false,
      controlb62: false,
      controlb63: false,
      controlb64: false,
      controlb65: false,
      controlb66: false,
      controlb7: false,
      controlb72: false,
      controlb8: false,
    //   controlb811: false,
      controlb9: false,
    //   controlb911: false,
      controlb917: false,
      controlb10: false,
    //   controlb1011: false,
      controlb1014: false,
      controlb11: false,
    //   controlb1111: false,
      controlb1113: false,
      controlb12: false,
      controlb14: false,
      controlb144: false,
      controlb15: false,
      controlb1538: false,
      controlb1615: false,
    //   controlb16: false,
    //   controlb1614: false,
      controlb1831: false,
      controlb191: false,
      controlb20: false,
      controlb202: false,
      controlb21: false,
      controla413: false,
      controlb82: false,
      controlb122: false,
      spinning: false,
      executeStatus: false,
      b2: undefined,
      b3: undefined,
      controlb70: false,
      controlb1711: false,
      controlb1721: false,
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      canEdit: false,
      submitInfo: undefined
    }
  },
  created() {
    this.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
    this.contentHeight = (this.clientHeight - 187);
    console.log(this.contentHeight);

    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
      .then(res => {
        that.patient = res.data.patient
        that.patientBasis = res.data.patientBasis
        that.orgTree = res.data.list
        that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
        that.canEdit = that.$ls.get(ACCESS_TOKEN).centerId === that.patient.targetCenterId
      })
      .catch(error => {
        console.log(error)
      })
    this.getFormData()
  },
  mounted() {
    this.form.setFieldsValue({ b70: '-1' })
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
          if (res.data && res.data.zkbszl) {
            that.zkbszl = that.dealAnswers(res.data.zkbszl)
          }
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
          if (splitArr.indexOf('3') > -1) {
            that.controla43 = true
          }
          if (splitArr.indexOf('4') > -1) {
            that.controla42 = true
          }
          if (splitArr.indexOf('13') > -1) {
            that.controla413 = true
          }
        }
        if (answer.b5) {
          splitArr = answer.b5.split(',')
          if (splitArr.indexOf('6') > -1) {
            that.controlb51 = true
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
          if (splitArr.indexOf('6') > -1) {
            that.controlb66 = true
          }
        }

        if (answer.b70 === 1) {
          that.controlb70 = true
        }

        if (answer.b7 === 1) {
          that.controlb7 = true
        }
        if (answer.b71) {
          splitArr = answer.b71.split(',')
          if (splitArr.indexOf('10') > -1) {
            that.controlb72 = true
          }
        }
        if (answer.b8 === 1) {
          that.controlb8 = true
        }
        if (answer.b81) {
          splitArr = answer.b81.split(',')
          if (splitArr.indexOf('1') > -1) {
            that.controlb82 = true
          }
        }
        if (answer.b9 === 1) {
          that.controlb9 = true
        }
        if (answer.b91) {
          splitArr = answer.b91.split(',')
          if (splitArr.indexOf('7') > -1) {
            that.controlb917 = true
          }
        }
        if (answer.b10 === 1) {
          that.controlb10 = true
        }
        if (answer.b11 === 1) {
          that.controlb11 = true
        }
        if (answer.b12 && answer.b12 === '1') {
          that.controlb12 = true
        }
        if (answer.b14 && answer.b14 === '1') {
          that.controlb14 = true
        }
        if (answer.b143) {
          splitArr = answer.b143.split(',')
          if (splitArr.indexOf('16') > -1) {
            that.controlb144 = true
          }
        }
        if (answer.b15 && answer.b15 === 1) {
          that.controlb15 = true
        }
        if (answer.b153) {
          splitArr = answer.b153.split(',')
          if (splitArr.indexOf('8') > -1) {
            that.controlb1538 = true
          }
        }
        if (answer.b161) {
          splitArr = answer.b161.split(',')
          if (splitArr.indexOf('5') > -1) {
            that.controlb1615 = true
          }
        }
        if (answer.b20 && answer.b20 === 1) {
          that.controlb20 = true
        }
        if (answer.b21 && answer.b21 === 1) {
          that.controlb21 = true
        }
        if (answer.b101) {
          splitArr = answer.b101.split(',')
          if (splitArr.indexOf('4') > -1) {
            that.controlb1014 = true
          }
        }
        if (answer.b111) {
          splitArr = answer.b111.split(',')
          if (splitArr.indexOf('3') > -1) {
            that.controlb1113 = true
          }
        }
        if (answer.b121) {
          splitArr = answer.b121.split(',')
          if (splitArr.indexOf('6') > -1) {
            that.controlb122 = true
          }
        }
        if(answer.b171){
          splitArr = answer.b171.split(',')
          if (splitArr.indexOf('2') > -1) {
            that.controlb1711 = true
          }
        }
        if(answer.b172){
          splitArr = answer.b172.split(',')
          if (splitArr.indexOf('4') > -1) {
            that.controlb1721 = true
          }
        }
        if (answer.b19 && (answer.b19 === 1 || answer.b19 === 2)) {
          that.controlb191 = true
        }
        if (answer.b183 && answer.b183 === 1) {
          that.controlb1831 = true
        }
        if (answer.b201) {
          splitArr = answer.b201.split(',')
          if (splitArr.indexOf('6') > -1) {
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
      let that = this
      if (t === 'controlb70' && e.target.value === '1') {
        this.controlb7 = false
        this.controlb72 = false
        this.controlb8 = false
        this.controlb82 = false
        this.controlb9 = false
        this.controlb917 = false
        this.controlb10 = false
        this.controlb1014 = false
        this.controlb11 = false
        this.controlb1113 = false
        this.controlb12 = false
        this.controlb122 = false
        this.controlb14 = false
        this.controlb144 = false
        this.controlb15 = false
        this.controlb1538 = false
        this.controlb1615 = false
        setTimeout(function () {
          that.form.setFieldsValue({
            b7: '-1',
            b8: '-1',
            b9: '-1',
            b10: '-1',
            b11: '-1',
            b12: '-1',
            b13: '-1',
            b14: '-1',
            b15: '-1',
            b161: ['1'],
          })
        })
      }
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
      if ((e.key >= 37 && e.key <= 42) || (e.key >= 45 && e.key <= 50)) {
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      } else {
        this.$router.replace('/list/task/' + this.patientBasisId + '/' + e.key)
      }
    },
    handleSubmit(e) {
      var _this = this
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          var re = this.form.getFieldsValue()
          var that = this
          re = {
            ...re,
            'a1': typeof re['a1'] !== 'undefined' ? re['a1'].join(',') : '',
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
            'b171': typeof re['b171'] !== 'undefined' ? re['b171'].join(',') : '',
            'b172': typeof re['b172'] !== 'undefined' ? re['b172'].join(',') : '',
            'b201': typeof re['b201'] !== 'undefined' ? re['b201'].join(',') : '',
            'b211': typeof re['b211'] !== 'undefined' ? re['b211'].format('YYYY-MM-DD') : ''
          }
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.zkbszl && this.zkbszl.zkbszlId) {
            re.zkbszlId = this.zkbszl.zkbszlId
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
                  that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
        } else {
          this.spinning = false
        }
      })
    },
    save() {
      var re = this.form.getFieldsValue()
      var that = this
      re = {
        ...re,
        'a1': typeof re['a1'] !== 'undefined' ? re['a1'].join(',') : '',
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
        'b171': typeof re['b171'] !== 'undefined' ? re['b171'].join(',') : '',
        'b172': typeof re['b172'] !== 'undefined' ? re['b172'].join(',') : '',
        'b201': typeof re['b201'] !== 'undefined' ? re['b201'].join(',') : '',
        'b211': typeof re['b211'] !== 'undefined' ? re['b211'].format('YYYY-MM-DD') : ''
      }
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.zkbszl && this.zkbszl.zkbszlId) {
        re.zkbszlId = this.zkbszl.zkbszlId
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
              that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
    handleOk(v) {
      this.submitInfo = v
      this.$refs.submitBtn.$el.click()
    },
    withdraw(){
      var that = this
      this.$confirm({
        title: '确认撤销？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('patientBasisMarkId', that.zkbszl.patientBasisMarkId)
          recoverSubmit(params)
            .then(res => {
              that.spinning = false
              that.$message.success(res.msg)
              params = new URLSearchParams()
              params.append('patientBasisId', that.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  
                  that.orgTree = res.data.list
                  that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
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
    padding: 10px;
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

    /deep/ .label-overflow .ant-form-item-label {
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

@media screen and (max-width: 1366px) {
  .control-m-line.ant-checkbox-group {
    top: 10px;
    position: relative;
  }
}

.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
</style>