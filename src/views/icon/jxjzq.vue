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
        <a-col :span="19" style="height: 100%;">
          <a-form :form="form" @submit="handleSubmit" class="base-form">
            <div class="btn-array" v-if="executeStatus !== 2 && canEdit">
              <a-button class="btn fr" type="primary" html-type="submit">提交</a-button>
              <a-button class="btn fr" @click="save">保存</a-button>
            </div>
            <div class="btn-array" v-if="executeStatus === 2 && canEdit">
              <a-button class="btn fr" type="primary" @click="withdraw">撤回</a-button>
            </div>
            <div class="baselineForm" :style="baselineFormStyle">
              <a-form-item label="(1) 急性加重日期" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" :disabledDate="disabledDate" v-decorator="['t', {...dateRequire, initialValue: initValue('t', 'time')}]"></a-date-picker>
              </a-form-item>
              <a-form-item label="(2) 急性加重的症状(多选):" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-checkbox-group v-decorator="['t1', {...selectRequired, initialValue: initValue('t1', 'array')}]" class="control-m-line">
                  <a-checkbox value="1">咳嗽</a-checkbox>
                  <a-checkbox value="2">咳痰</a-checkbox>
                  <a-checkbox value="3">脓性痰</a-checkbox>
                  <a-checkbox value="4">痰血</a-checkbox>
                  <a-checkbox value="5">咯血</a-checkbox>
                  <a-checkbox value="6">胸闷</a-checkbox>
                  <a-checkbox value="7">喘息</a-checkbox>
                  <a-checkbox value="8">呼吸困难</a-checkbox>
                  <a-checkbox value="9">胸痛</a-checkbox>
                  <a-checkbox value="10">发热</a-checkbox>
                  <a-checkbox value="11">乏力</a-checkbox>
                  <a-checkbox value="12">纳差</a-checkbox>
                  <a-checkbox value="13">消瘦</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item label="(3) 气道分泌物微生物培养" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['t2', {...require2, initialValue: initValue('t2')}]" @change="changeRadio($event, 'controlt2')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlt2">
                <a-form-item label="分离到微生物:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-checkbox-group v-decorator="['a', {...selectRequired, initialValue: initValue('a', 'array')}]">
                    <a-checkbox value="1" @change="changeSelect($event, 'control1')">细菌</a-checkbox>
                    <a-checkbox value="2" @change="changeSelect($event, 'control2')">真菌</a-checkbox>
                    <a-checkbox value="3" @change="changeSelect($event, 'control3')">分枝杆菌</a-checkbox>
                    <a-checkbox value="4" @change="changeSelect($event, 'control4')">其他</a-checkbox>
                    <a-checkbox value="5" @change="changeSelect($event, 'control5')">无</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <div v-if="control1">
                  <div class="title">1.细菌</div>
                  <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a1', {...dateRequire, initialValue: initValue('a1', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                  </a-form-item>
                  <a-form-item label="(2) 种类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-checkbox-group v-decorator="['a11', {...selectRequired, initialValue: initValue('a11', 'array')}]">
                      <a-checkbox value="1">铜绿假单胞菌</a-checkbox>
                      <a-checkbox value="2">肺炎链球菌</a-checkbox>
                      <a-checkbox value="3">肺炎克雷伯菌</a-checkbox>
                      <a-checkbox value="4">阴沟肠杆菌</a-checkbox>
                      <a-checkbox value="5">副流感嗜血杆菌</a-checkbox>
                      <a-checkbox value="6">鲍曼不动杆菌</a-checkbox>
                      <a-checkbox value="7">金黄色葡萄球菌</a-checkbox>
                      <a-checkbox value="8" @change="changeSelect($event, 'controla118')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="其他细菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controla118">
                    <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['a12', {...inputRequired, initialValue: initValue('a12')}]"></a-input>
                  </a-form-item>
                </div>
                <div v-if="control2">
                  <div class="title">2.真菌</div>
                  <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a2', {...dateRequire, initialValue: initValue('a2', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                  </a-form-item>
                  <a-form-item label="(2) 种类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-checkbox-group v-decorator="['a21', {...selectRequired, initialValue: initValue('a21', 'array')}]">
                      <a-checkbox value="1">曲霉</a-checkbox>
                      <a-checkbox value="2" @change="changeSelect($event, 'controla212')">其他</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item label="其他真菌名称:" :labelCol="labelColOffset2" :wrapperCol="wrapperOffset2" v-if="controla212">
                    <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['a22', {...inputRequired, initialValue: initValue('a22')}]"></a-input>
                  </a-form-item>
                </div>
                <div v-if="control3">
                  <div class="title">3.分枝杆菌</div>
                  <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a3', {...dateRequire, initialValue: initValue('a3', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                  </a-form-item>
                  <a-form-item label="(2) 种类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-checkbox-group v-decorator="['a31', {...selectRequired, initialValue: initValue('a31', 'array')}]">
                      <a-checkbox value="1">结核分枝杆菌</a-checkbox>
                      <a-checkbox value="2">非结核分枝杆菌</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </div>
                <div v-if="control4">
                  <div class="title">4.其他病原</div>
                  <a-form-item label="(1) 取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a4', {...dateRequire, initialValue: initValue('a4', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                  </a-form-item>
                  <a-form-item label="(2) 种类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                    <a-input style="width: 240px;" v-decorator="['a41', {...inputRequired, initialValue: initValue('a41')}]" autocomplete="off"></a-input>
                  </a-form-item>
                </div>
              </div>
              <a-form-item label="(4) 其他方法获得的病原学信息" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
              </a-form-item>
              <a-form-item label="取样日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['a5', {...dateRequire, initialValue: initValue('a5', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
              </a-form-item>
              <a-form-item label="种类:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-input style="width: 240px;" v-decorator="['a51', {...inputRequired, initialValue: initValue('a51')}]" autocomplete="off"></a-input>
              </a-form-item>
              <a-form-item label="(5) 血常规检测结果" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-radio-group v-decorator="['b1', {...require2, initialValue: initValue('b1')}]" @change="changeRadio($event, 'controlb1')">
                  <a-radio value="1">有</a-radio>
                  <a-radio value="-1">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <div v-if="controlb1">
                <a-form-item label="检查时间" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" v-decorator="['b11', { ...dateRequire, initialValue: initValue('b11', 'time')}]" :disabledDate="disabledDate" style="width: 240px;"></a-date-picker>
                </a-form-item>
                <a-form-item label="白细胞:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b12', {...inputNumRequired, initialValue: initValue('b12')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="中性粒细胞绝对值:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b13', {...inputNumRequired, initialValue: initValue('b13')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="淋巴细胞绝对值:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b14', {...inputNumRequired, initialValue: initValue('b14')}]" addonAfter="10^9/L" autocomplete="off"></a-input>
                </a-form-item>
                <a-form-item label="C反应蛋白:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;" v-decorator="['b15', {...inputNumRequired, initialValue: initValue('b15')}]" addonAfter="mg/L" autocomplete="off"></a-input>
                </a-form-item>
              </div>
              <a-form-item label="(6) 本次支气管扩张急性加重的住院日期" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-date-picker placeholder="请选择" v-decorator="['b21', { ...dateRequire, initialValue: initValue('b21', 'time')}]" :disabledDate="disabledDate" style="width: 240px;"></a-date-picker>
              </a-form-item>
              <a-form-item label="本次支气管扩张急性加重的出院日期" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                <a-date-picker placeholder="请选择" v-decorator="['b22', { ...dateRequire, initialValue: initValue('b22', 'time')}]" :disabledDate="disabledDate" style="width: 240px;"></a-date-picker>
              </a-form-item>
              <a-form-item label="(7) 本次支气管扩张急性加重时的抗生素治疗" :labelCol="labelColHor" :wrapperCol="wrapperHor" class="border-dotted">
                <a-checkbox-group v-decorator="['b3', {...selectRequired, initialValue: initValue('b3', 'array')}]" class="control-m-line">
                  <a-checkbox value="1" @change="changeSelect($event, 'controlb31')">哌拉西林</a-checkbox>
                  <a-checkbox value="2" @change="changeSelect($event, 'controlb32')">哌拉西林/他唑巴坦</a-checkbox>
                  <a-checkbox value="3" @change="changeSelect($event, 'controlb33')">头孢他啶</a-checkbox>
                  <a-checkbox value="4" @change="changeSelect($event, 'controlb34')">头孢哌酮</a-checkbox>
                  <a-checkbox value="5" @change="changeSelect($event, 'controlb35')">头孢哌酮/舒巴坦</a-checkbox>
                  <a-checkbox value="6" @change="changeSelect($event, 'controlb36')">头孢吡肟</a-checkbox>
                  <a-checkbox value="7" @change="changeSelect($event, 'controlb37')">亚胺培南</a-checkbox>
                  <a-checkbox value="8" @change="changeSelect($event, 'controlb38')">美罗培南</a-checkbox>
                  <a-checkbox value="9" @change="changeSelect($event, 'controlb39')">氨曲南</a-checkbox>
                  <a-checkbox value="10" @change="changeSelect($event, 'controlb310')">环丙沙星</a-checkbox>
                  <a-checkbox value="11" @change="changeSelect($event, 'controlb311')">左氧氟沙星</a-checkbox>
                  <a-checkbox value="12" @change="changeSelect($event, 'controlb312')">阿米卡星</a-checkbox>
                  <a-checkbox value="13" @change="changeSelect($event, 'controlb313')">妥布霉素</a-checkbox>
                  <a-checkbox value="14" @change="changeSelect($event, 'controlb314')">庆大霉素</a-checkbox>
                  <a-checkbox value="15" @change="changeSelect($event, 'controlb315')">多黏菌素E</a-checkbox>
                  <a-checkbox value="16" @change="changeSelect($event, 'controlb316')">多黏菌素B</a-checkbox>
                  <a-checkbox value="17" @change="changeSelect($event, 'controlb317')">磷霉素</a-checkbox>
                  <a-checkbox value="18" @change="changeSelect($event, 'controlb318')">其他</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <div v-if="controlb31">
                <a-form-item label="哌拉西林起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b31', {...dateRequire, initialValue: initValue('b31', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="哌拉西林停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b32', {...dateRequire, initialValue: initValue('b32', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb32">
                <a-form-item label="哌拉西林/他唑巴坦起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b41', {...dateRequire, initialValue: initValue('b41', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="哌拉西林/他唑巴坦停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b42', {...dateRequire, initialValue: initValue('b42', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb33">
                <a-form-item label="头孢他啶起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b51', {...dateRequire, initialValue: initValue('b51', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="头孢他啶停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b52', {...dateRequire, initialValue: initValue('b52', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb34">
                <a-form-item label="头孢哌酮起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b61', {...dateRequire, initialValue: initValue('b61', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="头孢哌酮停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b62', {...dateRequire, initialValue: initValue('b62', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb35">
                <a-form-item label="头孢哌酮/舒巴坦起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b71', {...dateRequire, initialValue: initValue('b71', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="头孢哌酮/舒巴坦停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b72', {...dateRequire, initialValue: initValue('b72', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb36">
                <a-form-item label="头孢吡肟起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b81', {...dateRequire, initialValue: initValue('b81', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="头孢吡肟停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b82', {...dateRequire, initialValue: initValue('b82', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb37">
                <a-form-item label="亚胺培南起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b91', {...dateRequire, initialValue: initValue('b91', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="亚胺培南停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b92', {...dateRequire, initialValue: initValue('b92', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb38">
                <a-form-item label="美罗培南起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b101', {...dateRequire, initialValue: initValue('b101', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="美罗培南停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b102', {...dateRequire, initialValue: initValue('b102', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb39">
                <a-form-item label="氨曲南起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b111', {...dateRequire, initialValue: initValue('b111', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="氨曲南停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b112', {...dateRequire, initialValue: initValue('b112', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb310">
                <a-form-item label="环丙沙星起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b121', {...dateRequire, initialValue: initValue('b121', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="环丙沙星停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b122', {...dateRequire, initialValue: initValue('b122', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb311">
                <a-form-item label="左氧氟沙星起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b131', {...dateRequire, initialValue: initValue('b131', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="左氧氟沙星停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b132', {...dateRequire, initialValue: initValue('b132', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb312">
                <a-form-item label="阿米卡星起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b141', {...dateRequire, initialValue: initValue('b141', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="阿米卡星停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b142', {...dateRequire, initialValue: initValue('b142', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb313">
                <a-form-item label="妥布霉素起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b151', {...dateRequire, initialValue: initValue('b151', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="妥布霉素停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b152', {...dateRequire, initialValue: initValue('b152', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb314">
                <a-form-item label="庆大霉素起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b161', {...dateRequire, initialValue: initValue('b161', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="庆大霉素停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b162', {...dateRequire, initialValue: initValue('b162', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb315">
                <a-form-item label="多黏菌素E起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b171', {...dateRequire, initialValue: initValue('b171', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="多黏菌素E停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b172', {...dateRequire, initialValue: initValue('b172', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb316">
                <a-form-item label="多黏菌素B起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b181', {...dateRequire, initialValue: initValue('b181', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="多黏菌素B停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b182', {...dateRequire, initialValue: initValue('b182', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb317">
                <a-form-item label="磷霉素起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b191', {...dateRequire, initialValue: initValue('b191', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="磷霉素停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b192', {...dateRequire, initialValue: initValue('b192', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
              </div>
              <div v-if="controlb318">
                <a-form-item label="其他抗生素种类" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['b201', {...inputRequired, initialValue: initValue('b201')}]"></a-input>
                </a-form-item>
                <a-form-item label="其他抗生素起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b202', {...dateRequire, initialValue: initValue('b202', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="其他抗生素停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b203', {...dateRequire, initialValue: initValue('b203', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="其他抗生素种类" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['b211', {...inputRequired, initialValue: initValue('b211')}]"></a-input>
                </a-form-item>
                <a-form-item label="其他抗生素起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b212', {...dateRequire, initialValue: initValue('b212', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="其他抗生素停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b213', {...dateRequire, initialValue: initValue('b213', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="其他抗生素种类" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-input style="width: 240px;margin-right: 10px;" autocomplete="off" v-decorator="['b221', {...inputRequired, initialValue: initValue('b221')}]"></a-input>
                </a-form-item>
                <a-form-item label="其他抗生素起始日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b222', {...dateRequire, initialValue: initValue('b222', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
                </a-form-item>
                <a-form-item label="其他抗生素停药日期:" :labelCol="labelColHor" :wrapperCol="wrapperHor">
                  <a-date-picker placeholder="请选择" style="width: 240px;" v-decorator="['b223', {...dateRequire, initialValue: initValue('b223', 'time')}]" :disabledDate="disabledDate"></a-date-picker>
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
import { getPatientBasis, saveBasis, getBasisForm, getMedicineAllergyList, recoverSubmit } from '@/api/basis'
import { MyIcon } from '@/components/_util/util'
import AddTable from "@/views/account/center/model/table"
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'iconJxjzq',
  components: {
    STree,
    MyIcon,
    AddTable
  },
  data() {
    return {
      markName: 'iconjxjz',
      title: '急性加重期',
      openKeys: [],
      orgTree: [],
      patient: {},
      patientBasis: {},
      defaultSelectedKeys: [],
      baselineInfoStyle: {
        overflow: "auto",
        height: "100%",
        "padding-right": "0px",
        boxShadow: 'rgba(204, 204, 204,0.8) 1px 0px 20px'
      },
      baselineFormStyle: {
        // height: '444px',
        'padding-top': '52px'
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
      inputNumRequired: {
        rules: [{ type: 'number', required: true, message: '请填写数字！' }]
      },
      form: this.$form.createForm(this),
      patientBasisId: this.$route.params.id,
      iconjxjz: undefined,
      maskId: undefined,
      spinning: false,
      executeStatus: false,
      optionDataSource: [],
      picList: [],
      type: '',
      controlt2: false,
      isGroup: this.$ls.get(ACCESS_TOKEN).roleId === 1 || false,
      canEdit: false,
      control1: false,
      control2: false,
      control3: false,
      control4: false,
      control5: false,
      controla118: false,
      controla212: false,
      controlb1: false,
      controlb31: false,
      controlb32: false,
      controlb33: false,
      controlb34: false,
      controlb35: false,
      controlb36: false,
      controlb37: false,
      controlb38: false,
      controlb39: false,
      controlb310: false,
      controlb311: false,
      controlb312: false,
      controlb313: false,
      controlb314: false,
      controlb315: false,
      controlb316: false,
      controlb317: false,
      controlb318: false
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
        that.maskId = res.data.list[0].basisMarkId
        that.defaultSelectedKeys = [that.maskId]
        that.executeStatus = res.data.list[0].executeStatus
        that.canEdit = that.$ls.get(ACCESS_TOKEN).centerId === that.patient.targetCenterId
        that.getFormData()
      })
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
    changeSelect(e, t) {
      var that = this
      this[t] = e.target.checked
      if (t === 'control5' && e.target.checked) {
        this.control1 = false
        this.control2 = false
        this.control3 = false
        this.control4 = false
        //赋值必须要延时
        setTimeout(function() {
          that.form.setFieldsValue({ a: ['5'] })
        }, 0)
      }
    },
    changeRadio(e, t) {
      if (e.target.value === '1') {
        this[t] = true
      } else {
        this[t] = false
      }
    },
    handleClick(e) {
      if(e.key > 64){
        this.$router.replace('/basis/question/' + this.patientBasisId + '/' + e.key)
      }
      return false
    },
    handleSubmit(e) {
      e.preventDefault()
      const { form: { validateFieldsAndScroll } } = this
      this.confirmLoading = true
      validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var re = this.form.getFieldsValue()
          re = {
            ...re,
            'a': typeof re['a'] !== 'undefined' ? re['a'].join(',') : '',
            't1': typeof re['t1'] !== 'undefined' ? re['t1'].join(',') : '',
            'a11': typeof re['a11'] !== 'undefined' ? re['a11'].join(',') : '',
            'a21': typeof re['a21'] !== 'undefined' ? re['a21'].join(',') : '',
            'a31': typeof re['a31'] !== 'undefined' ? re['a31'].join(',') : '',
            'b3': typeof re['b3'] !== 'undefined' ? re['b3'].join(',') : '',
            't': typeof re['t'] !== 'undefined' ? re['t'].format('YYYY-MM-DD') : '',
            'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
            'a2': typeof re['a2'] !== 'undefined' ? re['a2'].format('YYYY-MM-DD') : '',
            'a3': typeof re['a3'] !== 'undefined' ? re['a3'].format('YYYY-MM-DD') : '',
            'a4': typeof re['a4'] !== 'undefined' ? re['a4'].format('YYYY-MM-DD') : '',
            'a5': typeof re['a5'] !== 'undefined' ? re['a5'].format('YYYY-MM-DD') : '',
            'b11': typeof re['b11'] !== 'undefined' ? re['b11'].format('YYYY-MM-DD') : '',
            'b31': typeof re['b31'] !== 'undefined' ? re['b31'].format('YYYY-MM-DD') : '',
            'b32': typeof re['b32'] !== 'undefined' ? re['b32'].format('YYYY-MM-DD') : '',
            'b41': typeof re['b41'] !== 'undefined' ? re['b41'].format('YYYY-MM-DD') : '',
            'b42': typeof re['b42'] !== 'undefined' ? re['b42'].format('YYYY-MM-DD') : '',
            'b51': typeof re['b51'] !== 'undefined' ? re['b51'].format('YYYY-MM-DD') : '',
            'b52': typeof re['b52'] !== 'undefined' ? re['b52'].format('YYYY-MM-DD') : '',
            'b61': typeof re['b61'] !== 'undefined' ? re['b61'].format('YYYY-MM-DD') : '',
            'b62': typeof re['b62'] !== 'undefined' ? re['b62'].format('YYYY-MM-DD') : '',
            'b71': typeof re['b71'] !== 'undefined' ? re['b71'].format('YYYY-MM-DD') : '',
            'b72': typeof re['b72'] !== 'undefined' ? re['b72'].format('YYYY-MM-DD') : '',
            'b81': typeof re['b81'] !== 'undefined' ? re['b81'].format('YYYY-MM-DD') : '',
            'b82': typeof re['b82'] !== 'undefined' ? re['b82'].format('YYYY-MM-DD') : '',
            'b91': typeof re['b91'] !== 'undefined' ? re['b91'].format('YYYY-MM-DD') : '',
            'b92': typeof re['b92'] !== 'undefined' ? re['b92'].format('YYYY-MM-DD') : '',
            'b101': typeof re['b101'] !== 'undefined' ? re['b101'].format('YYYY-MM-DD') : '',
            'b102': typeof re['b102'] !== 'undefined' ? re['b102'].format('YYYY-MM-DD') : '',
            'b111': typeof re['b111'] !== 'undefined' ? re['b111'].format('YYYY-MM-DD') : '',
            'b112': typeof re['b112'] !== 'undefined' ? re['b112'].format('YYYY-MM-DD') : '',
            'b121': typeof re['b121'] !== 'undefined' ? re['b121'].format('YYYY-MM-DD') : '',
            'b122': typeof re['b122'] !== 'undefined' ? re['b122'].format('YYYY-MM-DD') : '',
            'b131': typeof re['b131'] !== 'undefined' ? re['b131'].format('YYYY-MM-DD') : '',
            'b132': typeof re['b132'] !== 'undefined' ? re['b132'].format('YYYY-MM-DD') : '',
            'b141': typeof re['b141'] !== 'undefined' ? re['b141'].format('YYYY-MM-DD') : '',
            'b142': typeof re['b142'] !== 'undefined' ? re['b142'].format('YYYY-MM-DD') : '',
            'b151': typeof re['b151'] !== 'undefined' ? re['b151'].format('YYYY-MM-DD') : '',
            'b152': typeof re['b152'] !== 'undefined' ? re['b152'].format('YYYY-MM-DD') : '',
            'b161': typeof re['b161'] !== 'undefined' ? re['b161'].format('YYYY-MM-DD') : '',
            'b162': typeof re['b162'] !== 'undefined' ? re['b162'].format('YYYY-MM-DD') : '',
            'b171': typeof re['b171'] !== 'undefined' ? re['b171'].format('YYYY-MM-DD') : '',
            'b172': typeof re['b172'] !== 'undefined' ? re['b172'].format('YYYY-MM-DD') : '',
            'b181': typeof re['b181'] !== 'undefined' ? re['b181'].format('YYYY-MM-DD') : '',
            'b182': typeof re['b182'] !== 'undefined' ? re['b182'].format('YYYY-MM-DD') : '',
            'b191': typeof re['b191'] !== 'undefined' ? re['b191'].format('YYYY-MM-DD') : '',
            'b192': typeof re['b192'] !== 'undefined' ? re['b192'].format('YYYY-MM-DD') : '',
            'b201': typeof re['b201'] !== 'undefined' ? re['b201'].format('YYYY-MM-DD') : '',
            'b202': typeof re['b202'] !== 'undefined' ? re['b202'].format('YYYY-MM-DD') : '',
            'b211': typeof re['b211'] !== 'undefined' ? re['b211'].format('YYYY-MM-DD') : '',
            'b212': typeof re['b212'] !== 'undefined' ? re['b212'].format('YYYY-MM-DD') : '',
            'b221': typeof re['b221'] !== 'undefined' ? re['b221'].format('YYYY-MM-DD') : '',
            'b222': typeof re['b222'] !== 'undefined' ? re['b222'].format('YYYY-MM-DD') : ''
          }
          var that = this
          this.patientBasis.status = 2
          var params = new URLSearchParams()
          if (this.iconjxjz && this.iconjxjz.iconJxjzqId) {
            re.iconJxjzqId = this.iconjxjz.iconJxjzqId
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
              params.append('patientBasisId', this.patientBasisId)
              getPatientBasis(params)
                .then(res => {
                  that.orgTree = res.data.list
                  that.maskId = res.data.list[0].basisMarkId
                  that.defaultSelectedKeys = [that.maskId]
                  that.executeStatus = res.data.list[0].executeStatus
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
      if (!this.iconjxjz) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (!this.iconjxjz[key]) return type === 'array' ? [] : type === 'time' ? undefined : ''
      if (type === 'time') {
        return moment(this.iconjxjz[key])
      } else if (type === 'array') {
        return this.iconjxjz[key].split(',')
      } else {
        return this.iconjxjz[key] + ''
      }
    },
    getFormData() {
      this.spinning = true
      var that = this
      var params = new URLSearchParams()
      params.append('patientBasisId', this.patientBasisId)
      params.append('basisMarkId', that.maskId)
      getBasisForm(params)
        .then(res => {
          this.spinning = false
          if (res.data && res.data.iconjxjz)
            that.iconjxjz = that.dealAnswers(res.data)
        })
        .catch(error => {
          this.spinning = false
          console.log(error)
        })
    },
    dealAnswers(data) {
      var that = this
      var answer = data.iconjxjz
      if (answer && !_.isEmpty(answer)) {
        var splitArr = []
        if (answer.a) {
          splitArr = answer.a.split(',')
          if (splitArr.indexOf('1') > -1) {
            this.control1 = true
          }
          if (splitArr.indexOf('2') > -1) {
            this.control2 = true
          }
          if (splitArr.indexOf('3') > -1) {
            this.control3 = true
          }
          if (splitArr.indexOf('4') > -1) {
            this.control4 = true
          }
        }
        if (answer.a11) {
          splitArr = answer.a11.split(',')
          if (splitArr.indexOf('8') > -1) {
            this.controla118 = true
          }
        }
        if (answer.a21) {
          splitArr = answer.a21.split(',')
          if (splitArr.indexOf('2') > -1) {
            this.controla212 = true
          }
        }
        if (answer.b1 == 1) {
          this.controlb1 = true
        }
        if (answer.t2 == 1) {
          this.controlt2 = true
        }
        if (answer.b3) {
          splitArr = answer.b3.split(',')
          for (let i in splitArr) {
            this['controlb3' + splitArr[i]] = true
          }
        }
      }
      return answer
    },
    save() {
      var re = this.form.getFieldsValue()
      re = {
        ...re,
        'a': typeof re['a'] !== 'undefined' ? re['a'].join(',') : '',
        't1': typeof re['t1'] !== 'undefined' ? re['t1'].join(',') : '',
        'a11': typeof re['a11'] !== 'undefined' ? re['a11'].join(',') : '',
        'a21': typeof re['a21'] !== 'undefined' ? re['a21'].join(',') : '',
        'a31': typeof re['a31'] !== 'undefined' ? re['a31'].join(',') : '',
        'b3': typeof re['b3'] !== 'undefined' ? re['b3'].join(',') : '',
        'a1': typeof re['a1'] !== 'undefined' ? re['a1'].format('YYYY-MM-DD') : '',
        't': typeof re['t'] !== 'undefined' ? re['t'].format('YYYY-MM-DD') : '',
        'a2': typeof re['a2'] !== 'undefined' ? re['a2'].format('YYYY-MM-DD') : '',
        'a3': typeof re['a3'] !== 'undefined' ? re['a3'].format('YYYY-MM-DD') : '',
        'a4': typeof re['a4'] !== 'undefined' ? re['a4'].format('YYYY-MM-DD') : '',
        'a5': typeof re['a5'] !== 'undefined' ? re['a5'].format('YYYY-MM-DD') : '',
        'b11': typeof re['b11'] !== 'undefined' ? re['b11'].format('YYYY-MM-DD') : '',
        'b31': typeof re['b31'] !== 'undefined' ? re['b31'].format('YYYY-MM-DD') : '',
        'b32': typeof re['b32'] !== 'undefined' ? re['b32'].format('YYYY-MM-DD') : '',
        'b41': typeof re['b41'] !== 'undefined' ? re['b41'].format('YYYY-MM-DD') : '',
        'b42': typeof re['b42'] !== 'undefined' ? re['b42'].format('YYYY-MM-DD') : '',
        'b51': typeof re['b51'] !== 'undefined' ? re['b51'].format('YYYY-MM-DD') : '',
        'b52': typeof re['b52'] !== 'undefined' ? re['b52'].format('YYYY-MM-DD') : '',
        'b61': typeof re['b61'] !== 'undefined' ? re['b61'].format('YYYY-MM-DD') : '',
        'b62': typeof re['b62'] !== 'undefined' ? re['b62'].format('YYYY-MM-DD') : '',
        'b71': typeof re['b71'] !== 'undefined' ? re['b71'].format('YYYY-MM-DD') : '',
        'b72': typeof re['b72'] !== 'undefined' ? re['b72'].format('YYYY-MM-DD') : '',
        'b81': typeof re['b81'] !== 'undefined' ? re['b81'].format('YYYY-MM-DD') : '',
        'b82': typeof re['b82'] !== 'undefined' ? re['b82'].format('YYYY-MM-DD') : '',
        'b91': typeof re['b91'] !== 'undefined' ? re['b91'].format('YYYY-MM-DD') : '',
        'b92': typeof re['b92'] !== 'undefined' ? re['b92'].format('YYYY-MM-DD') : '',
        'b101': typeof re['b101'] !== 'undefined' ? re['b101'].format('YYYY-MM-DD') : '',
        'b102': typeof re['b102'] !== 'undefined' ? re['b102'].format('YYYY-MM-DD') : '',
        'b111': typeof re['b111'] !== 'undefined' ? re['b111'].format('YYYY-MM-DD') : '',
        'b112': typeof re['b112'] !== 'undefined' ? re['b112'].format('YYYY-MM-DD') : '',
        'b121': typeof re['b121'] !== 'undefined' ? re['b121'].format('YYYY-MM-DD') : '',
        'b122': typeof re['b122'] !== 'undefined' ? re['b122'].format('YYYY-MM-DD') : '',
        'b131': typeof re['b131'] !== 'undefined' ? re['b131'].format('YYYY-MM-DD') : '',
        'b132': typeof re['b132'] !== 'undefined' ? re['b132'].format('YYYY-MM-DD') : '',
        'b141': typeof re['b141'] !== 'undefined' ? re['b141'].format('YYYY-MM-DD') : '',
        'b142': typeof re['b142'] !== 'undefined' ? re['b142'].format('YYYY-MM-DD') : '',
        'b151': typeof re['b151'] !== 'undefined' ? re['b151'].format('YYYY-MM-DD') : '',
        'b152': typeof re['b152'] !== 'undefined' ? re['b152'].format('YYYY-MM-DD') : '',
        'b161': typeof re['b161'] !== 'undefined' ? re['b161'].format('YYYY-MM-DD') : '',
        'b162': typeof re['b162'] !== 'undefined' ? re['b162'].format('YYYY-MM-DD') : '',
        'b171': typeof re['b171'] !== 'undefined' ? re['b171'].format('YYYY-MM-DD') : '',
        'b172': typeof re['b172'] !== 'undefined' ? re['b172'].format('YYYY-MM-DD') : '',
        'b181': typeof re['b181'] !== 'undefined' ? re['b181'].format('YYYY-MM-DD') : '',
        'b182': typeof re['b182'] !== 'undefined' ? re['b182'].format('YYYY-MM-DD') : '',
        'b191': typeof re['b191'] !== 'undefined' ? re['b191'].format('YYYY-MM-DD') : '',
        'b192': typeof re['b192'] !== 'undefined' ? re['b192'].format('YYYY-MM-DD') : '',
        'b201': typeof re['b201'] !== 'undefined' ? re['b201'].format('YYYY-MM-DD') : '',
        'b202': typeof re['b202'] !== 'undefined' ? re['b202'].format('YYYY-MM-DD') : '',
        'b211': typeof re['b211'] !== 'undefined' ? re['b211'].format('YYYY-MM-DD') : '',
        'b212': typeof re['b212'] !== 'undefined' ? re['b212'].format('YYYY-MM-DD') : '',
        'b221': typeof re['b221'] !== 'undefined' ? re['b221'].format('YYYY-MM-DD') : '',
        'b222': typeof re['b222'] !== 'undefined' ? re['b222'].format('YYYY-MM-DD') : ''
      }
      var that = this
      this.patientBasis.status = 1
      var params = new URLSearchParams()
      if (this.iconjxjz && this.iconjxjz.iconJxjzqId) {
        re.iconJxjzqId = this.iconjxjz.iconJxjzqId
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
          params.append('patientBasisId', this.patientBasisId)
          getPatientBasis(params)
            .then(res => {
              that.orgTree = res.data.list
              that.maskId = res.data.list[0].basisMarkId
              that.defaultSelectedKeys = [that.maskId]
              that.executeStatus = res.data.list[0].executeStatus
            })
        })
        .catch(error => {
          that.spinning = false
          console.log(error)
        })
      return false
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    withdraw() {
      var that = this
      this.$confirm({
        title: '确认撤销？',
        onOk() {
          that.spinning = true
          var params = new URLSearchParams()
          params.append('patientBasisMarkId', that.iconjxjz.patientBasisMarkId)
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

.single-line {
  height: 56px;
  overflow: hidden;
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
    background-image: url(../../assets/treeTop.png);
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

      .treeSubTitle {
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
    // padding-top: 52px;
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
      top: 12px;
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

/deep/.page-header-index-wide[data-v-30448598] .ant-menu-submenu.ant-menu-submenu-inline .treeSubTitle {
  width: 120px;
}

/deep/.ant-menu-inline .ant-menu-submenu-title {
  padding-right: 0px;
}


.control-m-line.ant-checkbox-group {
  top: 10px;
  position: relative;
}


.base-form {
  height: 100%;
  -ms-overflow-x: hidden;
  overflow: hidden auto;
}
</style>