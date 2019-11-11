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
        <a-col :md="7" :sm="24" class="UserNameCard">
          <my-icon type="iconshenfenzhenghuaban" />
          身份证:{{ patient.card }}
        </a-col>
        <a-col :md="11" :sm="24" style="fontSize:18px;textAlign: right;">创建时间：{{ patientBasis.createDate | moment }}</a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px;padding-left: 0">
      <a-row :gutter="8">
        <a-col :span="5" :style="baselineInfoStyle">
          <s-tree :treeTitle="title" :defaultSelectedKeys="defaultSelectedKeys" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="19">
          <a-form :form="form" @submit="handleSubmit" style="height:100%;overflow:hidden auto;">
            <div style="overflow: hidden;margin-top: 10px;" v-if="executeStatus !== 2">
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <a-form-item label="过去一年是否有急性加重期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-radio-group v-decorator="['a1', {...require1, initialValue: initValue('a1')}]" @change="changeRadio($event, 'controla1')">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="-1">否</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controla1">
                <div class="title">1.急性加重期</div>
                <a-form-item label="(1) 过去一年的急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input v-decorator="['b1', {...inputRequired, initialValue: initValue('b1')}]" style="width: 240px;" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(2) 住院急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input v-decorator="['b2', {...inputRequired, initialValue: initValue('b2')}]" style="width: 240px;" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 门诊急性加重次数:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input v-decorator="['b3', {...inputRequired, initialValue: initValue('b3')}]" style="width: 240px;" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(4) 急性加重的症状(多选):" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['b4', {...selectRequired, initialValue: initValue('b4', 'array')}]">
                    <a-checkbox value="1">咳嗽加重</a-checkbox>
                    <a-checkbox value="2">痰量增多</a-checkbox>
                    <a-checkbox value="3">痰液黏度增加</a-checkbox>
                    <a-checkbox value="4">痰脓性增加</a-checkbox>
                    <a-checkbox value="5">喘息呼吸急促加重</a-checkbox>
                    <a-checkbox value="6">咯血新增或增多</a-checkbox>
                    <a-checkbox value="7">其他系统症状（如：乏力，发热等）</a-checkbox>
                    <a-checkbox value="8" :checked="controlb4" @change="changeSelect($event, 'controlb4')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="其他症状:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlb4">
                  <a-input v-decorator="['b41', {...inputRequired, initialValue: initValue('b41')}]" style="width: 240px;" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(5) 咳嗽频繁程度" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['b5', {...selectRequired, initialValue: initValue('b5')}]">
                    <a-radio value="1">轻度</a-radio>
                    <a-radio value="2">中度</a-radio>
                    <a-radio value="3">重度</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(6) 痰量" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['b6', {...inputRequired, initialValue: initValue('b6')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(7) 痰液粘稠Murry评分（单选）" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-popover>
                    <template slot="content">
                      <img src="../../../assets/murry.png" style="height: 260px;" />
                    </template>
                    <a-icon type="exclamation-circle" style="position: relative;left: -20px;color: #0399ec;cursor: pointer;" />
                  </a-popover>
                  <a-radio-group v-decorator="['b7', {...selectRequired, initialValue: initValue('b7')}]">
                    <a-radio value="1">粘液性</a-radio>
                    <a-radio value="2">黏脓性</a-radio>
                    <a-radio value="3">脓性</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(8) 痰血最多量" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['b8', {...inputRequired, initialValue: initValue('b8')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(9) 咯血最多量" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="ml/日" style="width: 240px;" v-decorator="['b9', {...inputRequired, initialValue: initValue('b9')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(10) 有无胸痛:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b10', {...require2, initialValue: initValue('b10')}]" @change="changeRadio($event, 'controla1')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(11) 急性加重期入院方式:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['b11', {...require2, initialValue: initValue('b11')}]" @change="changeRadio($event, 'controlb11')">
                    <a-radio value="1">住院</a-radio>
                    <a-radio value="2">门诊</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controlb11">
                  <a-form-item label="记录住院天数:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-input addonAfter="天" style="width: 240px;" v-decorator="['b111', {...inputRequired, initialValue: initValue('b111')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="住院总费用:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-input addonAfter="元" style="width: 240px;" v-decorator="['b112', {...inputRequired, initialValue: initValue('b112')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
                <a-form-item label="(12) 急性加重发生时间:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b12', {...dateRequire, initialValue: initValue('b12', 'time')}]"></a-date-picker>
                </a-form-item>
                <a-form-item label="(13) 持续时间:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input addonAfter="天" style="width: 240px;" v-decorator="['b13', {...inputRequired, initialValue: initValue('b13')}]" autocomplete="off"></a-input>
                </a-form-item>
                <div class="title">2.急性加重期的微生物检查</div>
                <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['c1', {...dateRequire, initialValue: initValue('c1', 'time')}]"></a-date-picker>
                </a-form-item>
                <a-form-item label="(2) 是否本院:" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                  <a-radio-group v-decorator="['c2', {...require1, initialValue: initValue('c2')}]" @change="changeRadio($event, 'controlc2')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="医院名称" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controlc2">
                  <a-input style="width: 240px;" v-decorator="['c21', {...inputRequired, initialValue: initValue('c21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) 标本来源（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['c3', {...require1, initialValue: initValue('c3')}]">
                    <a-radio value="1">痰液</a-radio>
                    <a-radio value="2">诱导痰</a-radio>
                    <a-radio value="3">支气管肺泡灌洗液</a-radio>
                    <a-radio value="4">咽拭子</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(4) 是否分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['c4', {...require1, initialValue: initValue('c4')}]" @change="changeRadio($event, 'controlc4')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="-1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor" v-if="controlc4">
                  <a-checkbox-group v-decorator="['c42', {...selectRequired, initialValue: initValue('c42', 'array')}]">
                    <a-checkbox value="0" @change="showList($event, '铜绿假单胞菌', 'controlc420')">铜绿假单胞菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[0]" v-if="controlc420"></add-table>
                    <a-checkbox value="1" @change="showList($event, '阴沟肠杆菌', 'controlc421')">阴沟肠杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[1]" v-if="controlc421"></add-table>
                    <a-checkbox value="2" @change="showList($event, '肺炎克雷伯菌', 'controlc422')">肺炎克雷伯菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[2]" v-if="controlc422"></add-table>
                    <a-checkbox value="3" @change="showList($event, '肺炎链球菌', 'controlc423')">肺炎链球菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[3]" v-if="controlc423"></add-table>
                    <a-checkbox value="4" @change="showList($event, '副流感嗜血杆菌', 'controlc424')">副流感嗜血杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[4]" v-if="controlc424"></add-table>
                    <a-checkbox value="5" @change="showList($event, '鲍曼不动杆菌', 'controlc425')">鲍曼不动杆菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[5]" v-if="controlc425"></add-table>
                    <a-checkbox value="6" @change="showList($event, '金黄色葡萄球菌', 'controlc426')">金黄色葡萄球菌</a-checkbox>
                    <add-table :dataSource="optionDataSource[6]" v-if="controlc426"></add-table>
                    <a-checkbox value="7" @change="showList($event, '其他', 'controlc427')">其他</a-checkbox>
                    <a-input style="width: 240px;margin-right: 10px;" v-if="controlc427" @change="otherChange($event, 7)" autocomplete="off"></a-input>
                    <add-table :dataSource="optionDataSource[7]" v-if="controlc427"></add-table>
                  </a-checkbox-group>
                </a-form-item>
                <div class="title">3.用药情况</div>
                <a-form-item label="(1) 抗生素使用情况（单选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d1', {...selectRequired, initialValue: initValue('d1')}]">
                    <a-radio value="1">口服</a-radio>
                    <a-radio value="2">静脉</a-radio>
                    <a-radio value="3">口服+静脉</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(2) β内酰胺类（多选）:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d2', {...selectRequired, initialValue: initValue('d2', 'array')}]">
                    <a-checkbox value="1">头孢他定</a-checkbox>
                    <a-checkbox value="2">头孢吡肟</a-checkbox>
                    <a-checkbox value="3">拉氧头孢</a-checkbox>
                    <a-checkbox value="4" :checked="controld24" @change="changeSelect($event, 'controld24')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld24">
                  <a-input style="width: 240px;" v-decorator="['d21', {...inputRequired, initialValue: initValue('d21')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(3) β内酰胺/酶抑制剂:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d3', {...selectRequired, initialValue: initValue('d3', 'array')}]">
                    <a-checkbox value="1">头孢他定</a-checkbox>
                    <a-checkbox value="2">头孢吡肟</a-checkbox>
                    <a-checkbox value="3" :checked="controld33" @change="changeSelect($event, 'controld33')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld33">
                  <a-input style="width: 240px;" v-decorator="['d31', {...inputRequired, initialValue: initValue('d31')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(4) 碳氢酶烯类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d4', {...selectRequired, initialValue: initValue('d4', 'array')}]">
                    <a-checkbox value="1">美罗培南</a-checkbox>
                    <a-checkbox value="2">亚胺培南</a-checkbox>
                    <a-checkbox value="3">比阿培南</a-checkbox>
                    <a-checkbox value="4" :checked="controld44" @change="changeSelect($event, 'controld44')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld44">
                  <a-input style="width: 240px;" v-decorator="['d41', {...inputRequired, initialValue: initValue('d41')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(5) 氨基糖甙类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d5', {...selectRequired, initialValue: initValue('d5', 'array')}]">
                    <a-checkbox value="1">阿米卡星</a-checkbox>
                    <a-checkbox value="2">妥布霉素</a-checkbox>
                    <a-checkbox value="3">依替米星</a-checkbox>
                    <a-checkbox value="4" :checked="controld54" @change="changeSelect($event, 'controld54')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld54">
                  <a-input style="width: 240px;" v-decorator="['d51', {...inputRequired, initialValue: initValue('d51')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(6) 喹诺酮类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d6', {...selectRequired, initialValue: initValue('d6', 'array')}]">
                    <a-checkbox value="1">环丙沙星</a-checkbox>
                    <a-checkbox value="2">左氧氟沙星</a-checkbox>
                    <a-checkbox value="3" :checked="controld63" @change="changeSelect($event, 'controld63')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld63">
                  <a-input style="width: 240px;" v-decorator="['d61', {...inputRequired, initialValue: initValue('d61')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(7) 单酰胺环类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d7', {initialValue: initValue('d7', 'array')}]">
                    <a-checkbox value="1">氨曲南</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="(8) 大环内酯类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d8', {...selectRequired, initialValue: initValue('d8', 'array')}]">
                    <a-checkbox value="1">阿奇霉素</a-checkbox>
                    <a-checkbox value="2">克拉霉素</a-checkbox>
                    <a-checkbox value="3">红霉素</a-checkbox>
                    <a-checkbox value="4" :checked="controld84" @change="changeSelect($event, 'controld84')">其他</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="其他" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld84">
                  <a-input style="width: 240px;" v-decorator="['d81', {...inputRequired, initialValue: initValue('d81')}]" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="(9) 多肽类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['d9', {...selectRequired, initialValue: initValue('d9', 'array')}]">
                    <a-checkbox value="1">多粘菌素B</a-checkbox>
                    <a-checkbox value="2">多粘菌素E</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="(10) 有无止血:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d10', {...require2, initialValue: initValue('d10')}]" @change="changeRadio($event, 'controld10')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item class="border-dotted" label="止血药物" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld10">
                  <a-checkbox-group v-decorator="['d101', {...selectRequired, initialValue: initValue('d101', 'array')}]">
                    <a-checkbox value="1">安络血</a-checkbox>
                    <a-checkbox value="2">云南白药</a-checkbox>
                    <a-checkbox value="3">垂体</a-checkbox>
                    <a-checkbox value="4">止血敏</a-checkbox>
                    <a-checkbox value="5">止血芳酸</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="(11) 有无雾化治疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d11', {...require2, initialValue: initValue('d11')}]" @change="changeRadio($event, 'controld11')">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="controld11">
                  <a-form-item label="雾化药物:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted">
                    <a-checkbox-group v-decorator="['d111', {...selectRequired, initialValue: initValue('d111', 'array')}]">
                      <a-checkbox value="1">乙酰半胱氨酸</a-checkbox>
                      <a-checkbox value="2" :checked="controld111" @change="changeSelect($event, 'controld111')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="其他:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld111">
                    <a-input style="width: 240px;" v-decorator="['d1111', {...inputRequired, initialValue: initValue('d1111')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="ICS:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" class="border-dotted">
                    <a-checkbox-group v-decorator="['d112', {...selectRequired, initialValue: initValue('d112', 'array')}]">
                      <a-checkbox value="1">布地奈德</a-checkbox>
                      <a-checkbox value="2" :checked="controld112" @change="changeSelect($event, 'controld112')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="其他:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset" v-if="controld112">
                    <a-input style="width: 240px;" v-decorator="['d1121', {...inputRequired, initialValue: initValue('d1121')}]" autocomplete="off"></a-input>
                  </a-form-item>
                  <a-form-item label="支气管扩张剂:" :labelCol="labelColOffset" :wrapperCol="wrapperOffset">
                    <a-checkbox-group v-decorator="['d113', {...selectRequired, initialValue: initValue('d113', 'array')}]">
                      <a-checkbox value="1">异丙托溴胺</a-checkbox>
                      <a-checkbox value="2">沙丁胺醇</a-checkbox>
                      <a-checkbox value="3">特布他林</a-checkbox>
                      <a-checkbox value="4">复方异丙托溴铵（异丙托溴胺+沙丁胺醇）</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </div>
                <a-form-item label="(12) 有无支气管镜检吸痰:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d12', {...require2, initialValue: initValue('d12')}]">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(13) 有无氧疗:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d13', {...require2, initialValue: initValue('d13')}]">
                    <a-radio value="1">有</a-radio>
                    <a-radio value="-1">无</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="(14) 有无机械通气:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-radio-group v-decorator="['d14', {...require2, initialValue: initValue('d14')}]">
                    <a-radio value="1">有创</a-radio>
                    <a-radio value="-1">无创</a-radio>
                  </a-radio-group>
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
import { mapActions } from 'vuex'
import { getPatientBasis, saveBasis, getBasisForm, getMedicineAllergyList } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import AddTable from '@/views/account/center/model/table'
export default {
  name: 'jxjzq',
  components: {
    STree,
    MyIcon,
    AddTable
  },
  data() {
    return {
      markName: 'fs_jxjzq',
      optionDataSource: [],
      title: '急性加重期',
      openKeys: [],
      orgTree: [],
      patient: {},
      patientBasis: {},
      defaultSelectedKeys: [17],
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      baselineFormStyle: {
        // height: '444px',
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
        md: { span: 5, offset: 3 }
      },
      wrapperOffset: {
        md: { span: 16 }
      },
      labelColOffset2: {
        md: { span: 6, offset: 3 }
      },
      wrapperOffset2: {
        md: { span: 15 }
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
      patientBasisId: this.$route.params.id,
      jxjzq: undefined,
      maskId: this.$route.meta.maskId,
      controla1: false,
      controlb4: false,
      controlb11: false,
      controlc2: false,
      controlc4: false,
      controlc420: false,
      controlc421: false,
      controlc422: false,
      controlc423: false,
      controlc424: false,
      controlc425: false,
      controlc426: false,
      controlc427: false,
      controld24: false,
      controld33: false,
      controld44: false,
      controld54: false,
      controld63: false,
      controld84: false,
      controld10: false,
      controld11: false,
      controld111: false,
      controld112: false,
      spinning: false,
      executeStatus: false
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
        that.executeStatus = _.find(res.data.list, function(v) { return v.basisMarkId === that.maskId }).executeStatus
        that.getFormData()
      })
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      this[t] = e.target.checked
    },
    changeRadio(e, t) {
      if (t === 'controlb41') {
        if (e.target.value === '4') {
          this[t] = true
        } else {
          this[t] = false
        }
      } else if (t === 'controlc2') {
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
    getFormData() {
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', that.maskId)
      getBasisForm(params)
        .then(res => {
          if (res.data && res.data.fs_jxjzq)
            that.jxjzq = that.dealAnswers(res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleClick(e) {
      this.maskId = e.key
      if ((e.key >= 37 && e.key <= 42) || (e.key >= 45 && e.key <= 50)) {
        this.$router.push('/basis/question/' + this.patientBasisId + '/' + this.maskId)
      } else {
        this.$router.push('/list/task/' + this.patientBasisId + '/' + this.maskId)
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          const allergy = []
          for (var key in this.optionDataSource) {
            _.each(this.optionDataSource[key], function(item) {
              allergy.push({
                markId: 2,
                microbeName: item.microbeName,
                antibiotic: item.antibiotic,
                antibioticResult: item.antibioticResult,
                allergyValue: item.allergyValue
              })
            })
          }
          var re = this.form.getFieldsValue()
          re = {
            ...re,
            'b4': typeof re['b4'] !== 'undefined' ? re['b4'].join(',') : '',
            'b12': typeof re['b12'] !== 'undefined' ? re['b12'].format('YYYY-MM-DD') : '',
            'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
            'c42': typeof re['c42'] !== 'undefined' ? re['c42'].join(',') : '',
            'd2': typeof re['d2'] !== 'undefined' ? re['d2'].join(',') : '',
            'd3': typeof re['d3'] !== 'undefined' ? re['d3'].join(',') : '',
            'd4': typeof re['d4'] !== 'undefined' ? re['d4'].join(',') : '',
            'd5': typeof re['d5'] !== 'undefined' ? re['d5'].join(',') : '',
            'd6': typeof re['d6'] !== 'undefined' ? re['d6'].join(',') : '',
            'd7': typeof re['d7'] !== 'undefined' ? re['d7'].join(',') : '',
            'd8': typeof re['d8'] !== 'undefined' ? re['d8'].join(',') : '',
            'd9': typeof re['d9'] !== 'undefined' ? re['d9'].join(',') : '',
            'd101': typeof re['d101'] !== 'undefined' ? re['d101'].join(',') : '',
            'd111': typeof re['d111'] !== 'undefined' ? re['d111'].join(',') : '',
            'd112': typeof re['d112'] !== 'undefined' ? re['d112'].join(',') : '',
            'd113': typeof re['d113'] !== 'undefined' ? re['d113'].join(',') : ''
          }
          var that = this
          console.log(re)
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.jxjzq && this.jxjzq.jxjzqId) {
            re.jxjzqId = this.jxjzq.jxjzqId
          }
          params.append('formData', JSON.stringify(re))
          params.append('patientBasis', JSON.stringify(this.patientBasis))
          params.append('basisMarkId', this.maskId)
          params.append('markName', this.markName)
          params.append('allergy', JSON.stringify(allergy))
          this.spinning = true
          saveBasis(params)
            .then(res => {
              console.log(res)
              that.$message.success(res.msg)
              that.spinning = false
              that.getFormData()
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
        } else {
          this.spinning = false
        }
      })
    },
    initValue(key, type = 'normal') {
      if (!this.jxjzq) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.jxjzq[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.jxjzq[key])
      } else if (type === 'array') {
        return this.jxjzq[key].split(',')
      } else {
        return this.jxjzq[key] + ''
      }
    },
    dealAnswers(data) {
      var that = this
      var alList = ['铜绿假单胞菌', '阴沟肠杆菌', '肺炎克雷伯菌', '肺炎链球菌', '副流感嗜血杆菌', '鲍曼不动杆菌', '金黄色葡萄球菌']
      var answer = data.fs_jxjzq
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.a1 === 1) {
          this.controla1 = true
        }
        if (answer.b4) {
          splitArr = answer.b4.split(',')
          if (splitArr.indexOf('8') > -1) {
            this.controlb4 = true
          }
        }
        if (answer.c2 === -1) {
          this.controlc2 = true
        }
        if (answer.c4 === 1) {
          this.controlc4 = true
        }
        if (answer.c42) {
          splitArr = answer.c42.split(',')
          if (splitArr.indexOf('0') > -1) {
            this.controlc420 = true
          }
          if (splitArr.indexOf('1') > -1) {
            this.controlc421 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.controlc422 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.controlc423 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.controlc424 = true
          }
          if (splitArr.indexOf('5') > -1) {
            this.controlc425 = true
          }
          if (splitArr.indexOf('6') > -1) {
            this.controlc426 = true
          }
          if (splitArr.indexOf('7') > -1) {
            this.controlc427 = true
          }
        }
        if (data[2]) {
          _.each(alList, function(v, i) {
            if (data[2][v]) {
              that.optionDataSource[i] = data[2][v]
            }
          })
        }
        if (answer.d2) {
          splitArr = answer.d2.split(',')
          if (splitArr.indexOf('4') > -1) {
            this.controld24 = true
          }
        }
      }
      return answer
    },
    save() {
      const allergy = []
      for (var key in this.optionDataSource) {
        _.each(this.optionDataSource[key], function(item) {
          allergy.push({
            markId: 2,
            microbeName: item.microbeName,
            antibiotic: item.antibiotic,
            antibioticResult: item.antibioticResult,
            allergyValue: item.allergyValue
          })
        })
      }
      var re = this.form.getFieldsValue()
      re = {
        ...re,
        'b4': typeof re['b4'] !== 'undefined' ? re['b4'].join(',') : '',
        'b12': typeof re['b12'] !== 'undefined' ? re['b12'].format('YYYY-MM-DD') : '',
        'c1': typeof re['c1'] !== 'undefined' ? re['c1'].format('YYYY-MM-DD') : '',
        'c42': typeof re['c42'] !== 'undefined' ? re['c42'].join(',') : '',
        'd2': typeof re['d2'] !== 'undefined' ? re['d2'].join(',') : '',
        'd3': typeof re['d3'] !== 'undefined' ? re['d3'].join(',') : '',
        'd4': typeof re['d4'] !== 'undefined' ? re['d4'].join(',') : '',
        'd5': typeof re['d5'] !== 'undefined' ? re['d5'].join(',') : '',
        'd6': typeof re['d6'] !== 'undefined' ? re['d6'].join(',') : '',
        'd7': typeof re['d7'] !== 'undefined' ? re['d7'].join(',') : '',
        'd8': typeof re['d8'] !== 'undefined' ? re['d8'].join(',') : '',
        'd9': typeof re['d9'] !== 'undefined' ? re['d9'].join(',') : '',
        'd101': typeof re['d101'] !== 'undefined' ? re['d101'].join(',') : '',
        'd111': typeof re['d111'] !== 'undefined' ? re['d111'].join(',') : '',
        'd112': typeof re['d112'] !== 'undefined' ? re['d112'].join(',') : '',
        'd113': typeof re['d113'] !== 'undefined' ? re['d113'].join(',') : ''
      }
      var that = this
      console.log(re)
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.jxjzq && this.jxjzq.jxjzqId) {
        re.jxjzqId = this.jxjzq.jxjzqId
      }
      params.append('formData', JSON.stringify(re))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.maskId)
      params.append('markName', this.markName)
      params.append('allergy', JSON.stringify(allergy))
      this.spinning = true
      saveBasis(params)
        .then(res => {
          console.log(res)
          that.$message.success(res.msg)
          that.spinning = false
          that.getFormData()
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    showList(e, name, controlNode) {
      if (e.target.checked) {
        this[controlNode] = true
        if (name == "其他") return
        this.getMedicineAllergyList(name, e.target.value)
      } else {
        this[controlNode] = false
        this.$set(this.optionDataSource, e.target.value, [])
      }
    },
    getMedicineAllergyList(value, index) {
      const that = this
      const params = new URLSearchParams()
      params.append('microbeName', value)
      getMedicineAllergyList(params).then(res => {
        const optionDataSource = _.map(res.data, function(v, i) {
          return {
            keyW: i,
            microbeName: v.microbeName,
            antibiotic: v.antibiotic,
            antibioticResult: v.antibioticResult,
            allergyValue: v.allergyValue
          };
        })
        that.$set(that.optionDataSource, index, optionDataSource)
      })
    },
    otherChange(e, index) {
      this.getMedicineAllergyList(e.target.value, index)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-spin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .2);

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