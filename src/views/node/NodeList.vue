<template>
  <page-header-wrapper v-if="pageShow">
    <!--页头-->
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          style="font-size: 24px; cursor: pointer; color: #151515"
          @click="refresh"
        />
      </a-tooltip>
    </template>

    <a-card :bordered="false">
      <!--搜索框-->
      <div class="table-page-search-wrapper">
        <!--搜索框-->
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :md="6" :sm="8">
              <a-form-item label="设备ID">
                <a-input
                  v-model="queryParam.deviceId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="会员ID">
                <a-input
                  v-model="queryParam.userId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="BossID">
                <a-input
                  v-model="queryParam.bossId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="代理商ID">
                <a-input
                  v-model="queryParam.agentId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="推荐人ID">
                <a-input
                  v-model="queryParam.referrerId"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="设备类型">
                <a-select
                  v-model="queryParam.deviceType"
                  placeholder="全部"
                  default-value="0"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="X86">X86</a-select-option>
                  <a-select-option value="BOX">盒子</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上机类型">
                <a-select v-model="queryParam.machineType" placeholder="全部">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">API</a-select-option>
                  <a-select-option value="1">OS</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="省份">
                <a-input
                  v-model="queryParam.province"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="advanced" :md="6" :sm="8">
              <a-form-item label="市">
                <a-input
                  v-model="queryParam.city"
                  @keyup.enter="$refs.table.refresh(true)"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="运营商">
                <a-select v-model="queryParam.isp" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="MOBILE">移动</a-select-option>
                  <a-select-option value="UNICOM">联通</a-select-option>
                  <a-select-option value="TELECOM">电信</a-select-option>
                  <a-select-option value="BROADNET">广电</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="在线状态">
                <a-select
                  v-model="queryParam.status"
                  placeholder="全部"
                  default-value="0"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="ONLINE">在线</a-select-option>
                  <a-select-option value="OUTLINE">离线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="阶段状态">
                <a-select v-model="queryParam.stage" placeholder="全部" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="SUBMITTED">已提交</a-select-option>
                  <a-select-option value="CENSORED">验收测试中</a-select-option>
                  <a-select-option value="UNCENSORED">验收未通过</a-select-option>
                  <a-select-option value="INSERVICE">服务中</a-select-option>
                  <a-select-option value="OFFLINE">已下线</a-select-option>
                  <a-select-option value="RETIRED">已清退</a-select-option>
                  <a-select-option value="EXCEPTION">异常</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 6) || 6" :sm="8">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 表格 -->
      <s-table
        ref="table"
        size="middle"
        :showTotal="true"
        :rowKey="(record) => record.id"
        :columns="columnsData"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
        :pagination="pagination"
        :scroll="{ x: 2500 }"
      >
        <!-- 表头 -->
        <template slot="title">
          <div
            style="
              min-height: 28px;
              line-height: 28px;
              overflow: auto;
              overflow-y: hidden;
              _height: 1%;
            "
            class="table-operator"
          >
            <a @click="onAdd"><a-icon type="plus" /> 添加设备</a>
            <a-divider type="vertical" />
            <a @click="onNodeTransfer"><a-icon type="swap" /> 设备转移</a>
            <a-divider type="vertical" />
            <a @click="onManualSettle"
              ><a-icon type="vertical-align-bottom" /> 拉取上游结算数据</a
            >
            <a-divider type="vertical" />
            <a @click="onManualSettleByIds"
              ><a-icon type="vertical-align-bottom" /> 拉取节点上游结算数据</a
            >
            <a-divider type="vertical" />
            <a @click="remove"><a-icon type="delete" /> 批量删除</a>
            <a-icon type="question-circle" title="只能删除已提交状态的节点" />
            <!-- 筛选列设置 -->
            <a-dropdown
              style="float: right"
              v-if="screenColumns.visible"
              v-model="screenColumns.model"
            >
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in screenColumns.data"
                  :key="index"
                  @click="saveScreenColumns(index, item)"
                >
                  <a-checkbox :checked="item.checked">{{ item.title }}</a-checkbox>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 0px"
                ><a-icon type="profile" /> 筛选列设置 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
        </template>
        <!-- 表格自定义渲染 -->
        <!-- 节点信息 -->
        <span slot="deviceId" slot-scope="text, record" style="font-size: 12px">
          <div>设备ID：{{ text }}</div>
          <div>业务SN：{{ record.upstreamSn }}</div>
        </span>
        <span slot="deviceType" slot-scope="text, record">
          <!--设备类型-->
          <a-tag v-if="text === 'X86'" color="pink">{{ record.deviceTypeName }}</a-tag>
          <a-tag v-else color="green">{{ record.deviceTypeName }}</a-tag>
        </span>
        <span slot="machineType" slot-scope="text, record">
          <!-- 上机类型machineType，0=API，1=OS -->
          <a-tag v-if="text === 0" color="green">API</a-tag>
          <a-tag v-else color="red">OS</a-tag>
        </span>
        <!--状态-->
        <span slot="nodeName" slot-scope="text, record">
          <!-- 节点名称 -->
          <div style="margin-bottom: 10px; color: #1b53eb">{{ text }}</div>
          <!-- 状态 -->
          <div style="margin-bottom: 10px">
            <a-badge :status="record.status === 'ONLINE' ? 'success' : 'error'" />
            <span>
              {{ record.statusName }}
            </span>
            <a-divider type="vertical" />
            <a-badge :status="record.stage === 'INSERVICE' ? 'success' : 'error'" />
            <span>{{ record.stageName }}</span>
          </div>
          <div>
            <!-- 运营商 -->
            <span>
              <a-tag v-if="record.isp === 'MOBILE'" color="pink">
                {{ record.ispName }}
              </a-tag>
              <a-tag v-else-if="record.isp === 'UNICOM'" color="green">
                {{ record.ispName }}
              </a-tag>
              <a-tag v-else="record.isp === 'TELECOM'" color="purple">
                {{ record.ispName }}
              </a-tag>
            </span>
            <!--异网-->
            <span v-if="record.crossIsp" style="font-size: 12px;">- 异网 -> </span>
            <span v-if="record.crossIsp">
              <a-tag v-if="record.crossIsp === 'MOBILE'" color="pink">
                {{ record.crossIspName }}
              </a-tag>
              <a-tag v-else-if="record.crossIsp === 'UNICOM'" color="green">
                {{ record.crossIspName }}
              </a-tag>
              <a-tag v-else="record.crossIsp === 'TELECOM'" color="purple">
                {{ record.crossIspName }}
              </a-tag>
            </span>
            <a-divider type="vertical" />
            <a-tag color="green">
              {{ record.natTypeName }}
            </a-tag>
          </div>
        </span>
        <!--调度模式-->
        <span slot="schedule" slot-scope="text, record">
          <!-- 运营商 -->
          <div style="margin-bottom: 10px">
            跨省调度:
            <span v-if="record.transProvSchedule === 0" style="color: #fa0202;font-weight: 500;">
              否 (省内调度)
            </span>
            <span v-else style="color: #0b07ee;font-weight: 500;">
              是 ({{ record.transProvRate }}%)
            </span>
          </div>
          <div style="margin-bottom: 10px">
            仅IPV6调度:
            <span v-if="record.ipv6Schedule === 0" style="color: #fa0202;font-weight: 500;">
              否
            </span>
            <span v-else style="color: #0b07ee;font-weight: 500;">
              是
            </span>
          </div>
          <div>
            调度时段: 
            <span v-if="record.periodSchedule === 'ALL_DAY'" style="color: #0b07ee;font-weight: 500;">
              全天
            </span>
            <span v-else-if="record.periodSchedule === 'NOON_EVENING'" style="color: #f19307;font-weight: 500;">
              午晚高峰
            </span>
            <span v-else-if="record.periodSchedule === 'EVENING'" style="color: #f50808;font-weight: 500;">
              晚高峰
            </span>
            <span v-else>
              --
            </span>
          </div>
        </span>
        <!-- 业务/上游 -->
        <span slot="business.name" slot-scope="text, record">
          <!-- 业务/上游 -->
          <div style="margin-bottom: 8px">{{ text }}</div>
          <div>{{ record.upstreamApiCompanyName }}</div>
        </span>
        <span slot="province" slot-scope="text, record">
          <!-- 地区 -->
          <span>{{ text + " - " + record.city }}</span>
        </span>
        <!-- 用户收益 -->
        <span slot="profitYesterday" slot-scope="text, record">
          <!--昨日收益和本月收益-->
          <div style="margin-bottom: 8px">
            <span>昨日: {{ text }}</span>
            <a-divider type="vertical" />
            <span>本月: {{ record.profitMonth }}</span>
          </div>
          <!--累计收益-->
          <div>累计: {{ record.profitTotal }}</div>
        </span>
        <!--最近利用率-->
        <span slot="lastDayUpUsage" slot-scope="text">
          <span v-if="text !== null">{{ multi(text, 100) }}%</span>
          <span v-else>-</span>
        </span>
        <!--上行-->
        <span slot="bwNum" slot-scope="text, record">
          <!--上报-->
          <div style="margin-bottom: 8px">
            <span>上报: {{ text }} * {{ record.usbw }}M</span>
          </div>
          <!--压测-->
          <div>压测: {{ record.bandWidth ? record.bandWidth + "M" : "--" }}</div>
        </span>
        <!--结算-->
        <span slot="business" slot-scope="text, record">
          {{
            (text.bossSettlementPeriodName || "-") +
            " | " +
            (text.userSettlementPeriodName || "-")
          }}
        </span>
        <!--创建/计费时间-->
        <span slot="createdAt" slot-scope="text, record">
          <div style="margin-bottom: 8px; font-size: 13px; color: #108ee9">
            创建:{{ text }}
          </div>
          <div style="font-size: 13px; color: #e93b10">计费:{{ record.billingTime }}</div>
        </span>
        <span slot="state" slot-scope="text, record">
          <span v-html="text === 0 ? '正常' : '停用'" />&nbsp;
          <a-tooltip v-if="text !== 0">
            <template slot="title">
              {{ record.stateDesc }}
            </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="onNodeDetails(record)">详细</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item @click="onEdit(record)">编辑</a-menu-item>
                <a-menu-item
                  v-if="
                    record.stage === 'SUBMITTED' || record.stage === 'SUBMITTED_SUCCESS'
                  "
                  @click="onDetectConnectivity(record.id, record.dialMode)"
                  >继续上机</a-menu-item
                >
                <a-menu-item
                  v-if="record.stage === 'AUDIT_FAILED'"
                  @click="onDetectConnectivity(record.id, record.dialMode)"
                  >重新上机</a-menu-item
                >
                <a-menu-item v-if="record.stage !== 'RETIRED'" @click="onRepel(record)"
                  >清退</a-menu-item
                >
              </a-menu>
              <a>更多<a-icon type="down" /></a>
            </a-dropdown>
          </template>
        </span>
      </s-table>
    </a-card>
    <!-- 节点详情 -->
    <a-drawer
      width="1400"
      title="节点详情"
      placement="right"
      :visible="nodeDetailsVisible"
      @close="onNodeDetailsClose"
    >
      <a-descriptions :column="3" v-if="nodeDetailsData !== null">
        <a-descriptions-item label="节点 ID">{{
          nodeDetailsData.id
        }}</a-descriptions-item>
        <a-descriptions-item label="设备 ID">{{
          nodeDetailsData.deviceId
        }}</a-descriptions-item>
        <a-descriptions-item label="节点名称">{{
          nodeDetailsData.nodeName
        }}</a-descriptions-item>
        <a-descriptions-item label="网络状态">{{
          nodeDetailsData.statusName
        }}</a-descriptions-item>
        <a-descriptions-item label="阶段状态">{{
          nodeDetailsData.stageName
        }}</a-descriptions-item>
        <a-descriptions-item label="绑定时间">{{
          nodeDetailsData.createdAt
        }}</a-descriptions-item>
        <a-descriptions-item label="运营商">{{
          nodeDetailsData.ispName
        }}</a-descriptions-item>
        <a-descriptions-item label="节点地域">{{
          nodeDetailsData.province + " " + nodeDetailsData.city
        }}</a-descriptions-item>
        <a-descriptions-item label="跨省调度">
          {{
            nodeDetailsData.isTransProv === 0
              ? "不支持"
              : "支持跨省，调度比例" + nodeDetailsData.transProvRate + "%"
          }}</a-descriptions-item
        >
      </a-descriptions>
      <a-tabs v-model="nodeDetailsActiveKey" @change="onNodeDetailsTabChange">
        <a-tab-pane :key="0" tab="收益">
          <a-table
            :columns="settledColumns"
            :data-source="settleData"
            size="middle"
            :row-key="(record) => record.id"
            :scroll="{ x: 2000 }"
          >
            <!--管理端信息-->
            <span slot="day" slot-scope="text">{{
              moment(text).format("YYYY-MM-DD")
            }}</span>
            <span slot="flow" slot-scope="text, record">{{
              div(text, record.settle.radix * record.settle.radix) + "M"
            }}</span>
            <span slot="manageDeductPrice" slot-scope="text, record">{{
              text + " / " + record.settle.managePriceSettleAmount
            }}</span>
            <span slot="manageDeductFlow" slot-scope="text, record">{{
              multi(text, 100) +
              "% / " +
              div(record.settle.manageFlow, record.settle.radix * record.settle.radix) +
              "M" +
              " / " +
              record.settle.manageFlowSettleAmount
            }}</span>

            <!--boss端信息-->
            <span slot="bossFlow" v-if="text !== undefined" slot-scope="text, record">
              {{
                div(text, record.settle.radix * record.settle.radix) +
                "M" +
                " / " +
                record.settleBoss.income
              }}
            </span>
            <span
              slot="bossDeductPrice"
              v-if="text !== undefined"
              slot-scope="text, record"
            >
              {{ text + " / " + record.settleBoss.priceCommAmount }}
            </span>
            <span
              slot="bossDeductFlow"
              v-if="text !== undefined"
              slot-scope="text, record"
            >
              {{
                multi(text, 100) +
                "% / " +
                div(
                  record.settleBoss.commFlow,
                  record.settle.radix * record.settle.radix
                ) +
                "M" +
                " / " +
                record.settleBoss.flowCommAmount
              }}
            </span>
            <span
              slot="bossSettleStatus"
              v-if="text !== undefined"
              slot-scope="text, record"
            >
              <span v-if="text === 0" style="color: red">未结算</span>
              <span v-else-if="text === 1" style="color: #108ee9">已结算</span>
              <span v-else>-</span>
              | {{ periodName(record.settleBoss.period) }} |
              <span v-if="record.settleBoss.settleTime !== null">{{
                moment(record.settleBoss.settleTime).format("YYYY-MM-DD")
              }}</span>
              <span v-else>-</span>
            </span>
            <!--代理商信息-->
            <span
              slot="agentDeductPrice"
              v-if="text !== undefined"
              slot-scope="text, record"
              >{{ text + " / " + record.settleAgent.priceCommAmount }}</span
            >
            <span
              slot="agentDeductFlow"
              v-if="text !== undefined"
              slot-scope="text, record"
            >
              {{
                multi(text, 100) +
                "% / " +
                div(
                  record.settleAgent.commFlow,
                  record.settle.radix * record.settle.radix
                ) +
                "M" +
                " / " +
                record.settleAgent.flowCommAmount
              }}
            </span>
            <span
              slot="agentSettleStatus"
              v-if="text !== undefined"
              slot-scope="text, record"
            >
              <span v-if="text === 0" style="color: red">未结算</span>
              <span v-else-if="text === 1" style="color: #108ee9">已结算</span>
              <span v-else>-</span>
              | {{ periodName(record.settleAgent.period) }} |
              <span v-if="record.settleAgent.settleTime !== null">{{
                moment(record.settleAgent.settleTime).format("YYYY-MM-DD")
              }}</span>
              <span v-else>-</span>
            </span>
            <!--推荐人信息-->
            <span
              slot="referrerDeductFlow"
              v-if="text !== null"
              slot-scope="text, record"
            >
              <span v-if="text.deductFlow !== null"
                >{{ multi(text.deductFlow, 100) }}%
              </span>
              <span v-else>- </span>
              /
              <span v-if="text.flow !== null">{{
                div(text.flow, record.settle.radix * record.settle.radix) + "M"
              }}</span>
              <span v-else>- </span>
              /
              {{ record.settleReferrer.settleAmount }}
            </span>
            <span
              slot="referrerSettleStatus"
              v-if="text !== undefined"
              slot-scope="text, record"
            >
              <span v-if="text === 0" style="color: red">未结算</span>
              <span v-else-if="text === 1" style="color: #108ee9">已结算</span>
              <span v-else>-</span>
              | {{ periodName(record.settleReferrer.period) }} |
              <span v-if="record.settleReferrer.settleTime !== null">{{
                moment(record.settleReferrer.settleTime).format("YYYY-MM-DD")
              }}</span>
              <span v-else>-</span>
            </span>

            <!--用户信息-->
            <span slot="userFlow" slot-scope="text, record">{{
              div(text, record.settle.radix * record.settle.radix) +
              "M" +
              " / " +
              record.settleUser.settleAmount
            }}</span>
            <span slot="userSettleStatus" slot-scope="text, record">
              <span v-if="text === 0" style="color: red">未结算</span>
              <span v-else-if="text === 1" style="color: #108ee9">已结算</span>
              <span v-else>-</span>
              | {{ periodName(record.settleUser.period) }} |
              <span v-if="record.settleUser.settleTime !== null">{{
                moment(record.settleUser.settleTime).format("YYYY-MM-DD")
              }}</span>
              <span v-else>-</span>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane :key="1" tab="监控" force-render>
          <a-select v-model="monitorSelect" style="width: 120px" @change="onMonitor">
            <a-select-option
              v-for="(item, index) in [
                { value: 0, label: '近6小时' },
                { value: 1, label: '近24小时' },
                { value: 2, label: '昨天' },
                { value: 3, label: '近3天' },
              ]"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-spin :spinning="monitorSpinning">
            <div
              v-if="
                monitorLogsData.up === null &&
                monitorLogsData.diskSum === null &&
                monitorLogsData.cpuIdle === null &&
                monitorLogsData.memoryPercent === null &&
                monitorLogsData.maxPacketLoss === null
              "
              style="padding: 20px; text-align: center; font-size: 13px; color: darkgrey"
            >
              没有数据
            </div>
            <ucharts-line
              v-if="monitorLogsData.up"
              title="上下行带宽/Mbps"
              canvasId="usbw"
              :categories="monitorLogsData.time"
              :series="[
                { name: '上行带宽', data: monitorLogsData.up },
                { name: '下行带宽', data: monitorLogsData.down },
              ]"
            />
            <ucharts-line
              v-if="monitorLogsData.diskSum"
              title="缓存/G"
              canvasId="diskSum"
              :categories="monitorLogsData.time"
              :series="[{ name: '缓存', data: monitorLogsData.diskSum }]"
            />
            <ucharts-line
              v-if="monitorLogsData.cpuIdle"
              title="CPU使用率/%"
              canvasId="cpuIdle"
              :categories="monitorLogsData.time"
              :series="[{ name: 'CPU使用率', data: monitorLogsData.cpuIdle }]"
            />
            <ucharts-line
              v-if="monitorLogsData.memoryPercent"
              title="内存使用率/%"
              canvasId="memoryPercent"
              :categories="monitorLogsData.time"
              :series="[{ name: '内存使用率', data: monitorLogsData.memoryPercent }]"
            />
            <ucharts-line
              v-if="monitorLogsData.maxPacketLoss"
              title="丢包线路数量与最大值"
              canvasId="maxPacketLoss"
              :categories="monitorLogsData.time"
              :series="[
                { name: '最大丢包率(%)', data: monitorLogsData.maxPacketLoss },
                { name: '丢包线路数', data: monitorLogsData.packetLossLineNum },
              ]"
            />
            <ucharts-line
              v-if="monitorLogsData.reRate"
              title="重传率/%"
              canvasId="reRate"
              :categories="monitorLogsData.time"
              :series="[{ name: '重传率', data: monitorLogsData.reRate }]"
            />
          </a-spin>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="异常信息" force-render>
          <span
            v-if="
              nodeDetailsData.suggestionMessage &&
              nodeDetailsData.suggestionMessage != null
            "
            style="color: red"
          >
            {{ nodeDetailsData.suggestionMessage }}
          </span>
          <br />
          <span v-if="nodeDetailsData.exceptionMsg" style="color: red">
            {{ nodeDetailsData.exceptionMsg }}
          </span>
        </a-tab-pane>
        <a-tab-pane :key="3" tab="网络信息" force-render>
          <a-descriptions :column="2" v-if="nodeDetailsData">
            <!--
            <a-descriptions-item label="IP">
              <div
                v-if="
                  nodeDetails.qualityreport.basic.ipv4 !== null ||
                  nodeDetails.qualityreport.basic.ipv6 !== null
                "
              >
                <div style="color: #007aff">
                  <span v-if="nodeDetails.qualityreport.basic.ipv4 !== null">
                    {{ nodeDetails.qualityreport.basic.ipv4 }}
                  </span>
                  <a-divider type="vertical" />
                  <span v-if="nodeDetails.qualityreport.basic.ipv6 !== null">
                    {{ nodeDetails.qualityreport.basic.ipv6 }}
                  </span>
                </div>
              </div>
              <div v-else-if="nodeDetails.qualityreport.pressure">
                <div
                  style="color: #007aff"
                  v-if="nodeDetails.qualityreport.pressure[0].lines[0].ip !== null"
                  title="点击复制"
                >
                  {{ nodeDetails.qualityreport.pressure[0].lines[0].ip }}
                </div>
                <div v-else>--</div>
              </div>
              <div v-else>--</div>
            </a-descriptions-item>
            -->
            <a-descriptions-item label="运营商/地区">
              <span style="color: #007aff">{{ nodeDetailsData.ispName }}</span>
              <a-divider type="vertical" />
              <span>{{ nodeDetailsData.province + "-" + nodeDetailsData.city }} </span>
            </a-descriptions-item>
            <a-descriptions-item label="NAT类型">{{
              nodeDetailsData.natTypeName
            }}</a-descriptions-item>
            <a-descriptions-item label="拨号方式">{{
              nodeDetailsData.dialModeName
            }}</a-descriptions-item>
            <a-descriptions-item label="拨号线路" v-if="nodeDetailsData.lineStat">
              <a @click="onDialInfoDrawer">
                <span style="color: #007aff">
                  拨号 {{ nodeDetailsData.lineStat.total }} 条</span
                >
                <a-divider type="vertical" />
                <span style="color: #007aff"
                  >拨通 {{ nodeDetailsData.lineStat.dialSucceedCount }} 条</span
                >
                <a-divider type="vertical" />
                <span style="color: red">
                  未拨通 {{ nodeDetailsData.lineStat.dialFailedCount }} 条
                </span>
                <a-divider type="vertical" />
                <span style="color: #007aff"
                  >联网 {{ nodeDetailsData.lineStat.connectedCount }} 条</span
                >
              </a>
            </a-descriptions-item>
            <a-descriptions-item label="建设带宽条数">
              <span>
                {{ nodeDetailsData.bwNum ? nodeDetailsData.bwNum : "--" }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="单条建设带宽">
              <span>
                {{ nodeDetailsData.usbw + "Mbps" }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="总建设带宽">
              <span>
                {{
                  nodeDetailsData.usbw +
                  "Mbps * " +
                  (nodeDetailsData.bwNum ? nodeDetailsData.bwNum : 1) +
                  " = " +
                  nodeDetailsData.usbw *
                    (nodeDetailsData.bwNum ? nodeDetailsData.bwNum : 1) +
                  "Mbps"
                }}
              </span>
              <!--下面用空一格-->
              <a-divider type="vertical" />
              <span
                v-if="
                  nodeDetailsData.netBenchStatus &&
                  nodeDetailsData.netBenchStatus === 'doing'
                "
              >
                压测中
              </span>
              <!--
              <a
                v-if="nodeDetails.netBenchStatus !== 'doing'"
                style="color: #007aff"
                @click="
                  onNetPressure(
                    nodeDetails.id,
                    nodeDetails.netPressureNum,
                    nodeDetails.nodeId,
                    nodeDetails.usbw
                  )
                "
              >
                压测
              </a>
              <a-divider v-if="nodeDetails.netBenchStatus !== 'doing'" type="vertical" />
              <a
                v-if="nodeDetails.netBenchStatus !== 'doing'"
                @click="onUsbwOpen(nodeDetails)"
              >
                调整建设带宽</a
              >
              -->
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane :key="4" tab="压测报告" force-render>
          <a-spin :spinning="networkPressureSpinning">
            <NetworkPressureInfo
              :network-pressure-data="networkPressureData"
              @pressure="handleNetworkPressure"
            />
          </a-spin>
        </a-tab-pane>
        <a-tab-pane :key="5" tab="硬件信息">
          <!--硬件基础信息-->
          <description-card
            v-if="nodeDetailsData.hardware !== undefined"
            :data-source="nodeDetailsData.hardware"
            title="基础信息"
            :column="3"
            :items="[
              { label: '架构', key: 'architecture' },
              { label: '主机名', key: 'hostname' },
              { label: '系统名称', key: 'osName' },
              { label: '操作系统', key: 'osPretty' },
              { label: 'CPU型号', key: 'cpuModel' },
              { label: '物理核数', key: 'cpuPhysicalCores' },
              { label: '逻辑核心数', key: 'cpuLogicalCores' },
              { label: 'CPU线程数', key: 'cpuThreads' },
              { label: 'CPU主频', key: 'cpuMhz' },
              { label: '最大CPU频率', key: 'cpuMaxMhz' },
              { label: '内存', key: 'memory', slotName: 'mem' }, // 使用插槽自定义显示
              { label: '磁盘容量', key: 'diskSize', slotName: 'diskSize' },
            ]"
          >
            <!-- 自定义硬盘信息显示 -->
            <template #mem="{ value }"> {{ value }} G </template>
            <template #diskSize="{ value }"> {{ value }} G </template>
          </description-card>
          <!--磁盘信息-->
          <div v-if="nodeDetailsData.disks" class="disk-info">磁盘信息</div>
          <a-table
            v-if="nodeDetailsData.disks"
            :columns="[
              { title: '磁盘', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
              {
                title: '类型',
                dataIndex: 'type',
                scopedSlots: { customRender: 'type' },
                width: '120px',
              },
              {
                title: '总容量/已使用',
                dataIndex: 'size',
                scopedSlots: { customRender: 'size' },
                width: '180px',
              },
              {
                title: '利用率',
                dataIndex: 'usage',
                scopedSlots: { customRender: 'usage' },
                width: '100px',
              },
              { title: '读IOPS(io/s)', dataIndex: 'iopsRead' },
              { title: '写IOPS(io/s)', dataIndex: 'iopsWrite' },
              {
                title: '读取延迟',
                dataIndex: 'readAwait',
                scopedSlots: { customRender: 'readAwait' },
              },
              {
                title: '写入延迟',
                dataIndex: 'writeAwait',
                scopedSlots: { customRender: 'writeAwait' },
              },
              {
                title: '读速率',
                dataIndex: 'speedRead',
                scopedSlots: { customRender: 'speedRead' },
              },
              {
                title: '写速率',
                dataIndex: 'speedWrite',
                scopedSlots: { customRender: 'speedWrite' },
              },
            ]"
            :data-source="nodeDetailsData.disks"
            :row-key="(record, index) => index"
            :pagination="false"
          >
            <span slot="name" slot-scope="text, record">
              <div>名称：{{ text }}</div>
              <div v-if="record.sn">序列号：{{ record.sn }}</div>
              <div v-if="record.model">型号：{{ record.model }}</div>
            </span>
            <span slot="type" slot-scope="text, record">
              <span v-if="text === 'HDD'">机械</span>
              <span v-else-if="text === 'SSD'">固态</span>
              <span v-else-if="text === 'NVME'">NVME</span>
              <span v-else>--</span>
              <span v-if="record.systemDisk === 1"> (系统盘)</span>
            </span>
            <span slot="size" v-if="text" slot-scope="text, record">
              <span>{{ text + "G / " }}</span>
              <span>{{ record.usedSize ? record.usedSize + "G" : "--" }}</span>
            </span>
            <span slot="usage" v-if="text" slot-scope="text">{{ text + " %" }}</span>
            <span slot="readAwait" v-if="text" slot-scope="text">{{ text + " ms" }}</span>
            <span slot="writeAwait" v-if="text" slot-scope="text">{{
              text + " ms"
            }}</span>
            <span slot="speedRead" v-if="text" slot-scope="text">{{
              text + " KB/s"
            }}</span>
            <span slot="speedWrite" v-if="text" slot-scope="text">{{
              text + " KB/s"
            }}</span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane :key="6" tab="调度配置" force-render>
          <a-alert
            message="建议非高峰时间操作（高峰时间12:00-14:00,18:00-23:59）"
            type="warning"
            show-icon
          />
          <div style="margin-top: 20px"></div>
          <a-form-model
            ref="scheduleRef"
            :model="scheduleFormData"
            :rules="scheduleRules"
            :label-col="{ lg: { span: 2 }, sm: { span: 2 } }"
            :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
          >
            <a-form-model-item
              ref="isTransProv"
              label="跨省调度"
              prop="isTransProv"
              :help="
                scheduleFormData.isTransProv == 0
                  ? '不支持跨省调度节点或支持但跨省比例小于100%的节点跑量将会偏低'
                  : ''
              "
            >
              <a-radio-group v-model="scheduleFormData.isTransProv">
                <a-radio :value="1"> 支持 </a-radio>
                <a-radio :value="0"> 不支持 </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              v-if="scheduleFormData.isTransProv == 1"
              ref="transProvRate"
              label="调度比例"
              prop="transProvRate"
            >
              <a-input
                v-model="scheduleFormData.transProvRate"
                type="number"
                suffix="%"
              />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
              <a-button v-if="!isModifySchedule" @click="isModifySchedule = true"
                >修改</a-button
              >
              <a-button
                v-if="isModifySchedule"
                style="margin-right: 20px"
                type="primary"
                @click="onSchedule"
                >确定</a-button
              >
              <a-button v-if="isModifySchedule" @click="isModifySchedule = false"
                >取消</a-button
              >
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
    <create-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="handleOk"
    />
    <!--节点清退弹出框-->
    <a-modal
      :visible="repelVisible"
      :width="680"
      :dialog-style="{ top: '30px' }"
      title="节点清退"
      @cancel="repelHandleCancel"
      @ok="repelHandleOk"
    >
      <!--表单 并将表单的值绑定到this.from-->
      <a-form
        :form="repelForm"
        v-bind="{
          labelCol: { xs: { span: 24 }, sm: { span: 5 } },
          wrapperCol: { xs: { span: 24 }, sm: { span: 17 } },
        }"
      >
        <a-form-item v-show="false" label="用户ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <!--每一项元素-->
        <a-form-item label="清退原因">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-select
                placeholder="请选择清退原因"
                v-decorator="[
                  'reason',
                  {
                    rules: [{ required: true, message: '清退原因不能为空' }],
                  },
                ]"
                @change="onChangeReason"
              >
                <a-select-option value="运营商监管">运营商监管</a-select-option>
                <a-select-option value="限电">限电</a-select-option>
                <a-select-option value="带宽质量问题">带宽质量问题</a-select-option>
                <a-select-option value="跑量不满意">跑量不满意</a-select-option>
                <a-select-option value="长时间离线">长时间离线</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="isOther" label="其他原因">
          <a-row :gutter="[8]">
            <a-col :span="24">
              <a-input
                placeholder="请输入其他原因"
                autocomplete="off"
                v-decorator="[
                  'other',
                  {
                    rules: [{ required: true, message: '其他原因不能为空' }],
                  },
                ]"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--拨号信息抽屉-->
    <DialInfoDrawer
      :open="dialInfoOpen"
      :id="nodeDetailsData.id"
      @close="
        () => {
          dialInfoOpen = false;
        }
      "
      @modifyLineClick="handleModifyLineClick"
    />
    <!-- 编辑节点抽屉 -->
    <edit-node-drawer
      :visible="editDrawerVisible"
      :record="currentEditRecord"
      @close="editDrawerVisible = false"
      @success="$refs.table.refresh()"
    />
    <!-- 添加节点抽屉 -->
    <add-device-drawer
      :visible="addDrawervisible"
      :deviceId="deviceId"
      @close="handleClose"
      @success="handleSuccess"
    />
    <!-- 测试连接抽屉 -->
    <detect-connectivity-drawer
      :visible="detectConnectivityVisible"
      :id="detectConnectivityId"
      :dial-mode="dialMode"
      @close="handleDetectConnectivityClose"
      @success="handleDetectConnectivitySuccess"
      @dial="handleDial"
    />
    <!-- 线路配置抽屉 -->
    <line-config-drawer
      :visible="lineConfigVisible"
      :id="lineConfigId"
      :dial-mode="dialMode"
      :eths="eths"
      @success="handleLineConfigSuccess"
      @close="handleLineConfigClose"
    />
    <!-- 调整线路抽屉 -->
    <modify-line-drawer
      :visible="modifyLineVisible"
      :id="modifyLineId"
      :dial-mode="dialMode"
      :eths="eths"
      @success="handleModifyLineSuccess"
      @close="handleModifyLineClose"
    />
  </page-header-wrapper>
</template>

<script>
// import { mapState } from 'vuex'
import { STable, Ellipsis } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
import CreateInfoModel from "@/views/modules/CreateInfoModel";
import {
  Page,
  Remove,
  Details,
  Edit,
  NodeTransfer,
  ManualSettle,
  ManualSettleByIds,
  Repel,
  GetMonitorLogs,
  ModifySchedule,
  GetNodeDetails,
  GetNetworkPressure,
  SendNetworkPressures,
} from "@/api/node/list";
import { timeStampToFormatDate } from "@/utils/timeUtil";
import { handlerResult, isPageResult } from "@/api/handlerResult";
import { multi, div } from "@/utils/operationUtil";
import { ChartCard, MiniArea, MiniBar, MiniProgress } from "@/components";
import UchartsLine from "@/components/Ucharts/UchartsLine.vue";
import DescriptionCard from "@/components/description/DescriptionCard/DescriptionCard.vue";
// 节点网络压测组件
import NetworkPressureInfo from "./components/NetworkPressureInfo/NetworkPressureInfo.vue";
// 时间格式化工具
import moment from "moment";

import dayjs from "dayjs";

import VueClipboards from "vue-clipboard2";
import DialInfoDrawer from "./components/dialInfoDrawer/DialInfoDrawer.vue";
import EditNodeDrawer from "./components/EditNodeDrawer";
import AddDeviceDrawer from "./components/AddDeviceDrawer.vue";
import DetectConnectivityDrawer from "./components/DetectConnectivityDrawer";
import LineConfigDrawer from "./components/LineConfigDrawer";
// 调整线路
import ModifyLineDrawer from "./components/ModifyLineDrawer";

// 表格字段，checked是否显示
const columns = [
  {
    title: "设备信息",
    dataIndex: "deviceId",
    scopedSlots: { customRender: "deviceId" },
    checked: true,
    width: "290px",
  },
  {
    title: "设备类型",
    dataIndex: "deviceType",
    scopedSlots: { customRender: "deviceType" },
    checked: true,
    width: "80px",
  },
  {
    title: "上机类型",
    dataIndex: "machineType",
    scopedSlots: { customRender: "machineType" },
    checked: true,
    width: "80px",
  },
  {
    title: "BossID",
    dataIndex: "bossId",
    checked: false,
    width: "80px",
  },
  {
    title: "代理商ID",
    dataIndex: "agentId",
    checked: false,
    width: "80px",
  },
  {
    title: "推荐人ID",
    dataIndex: "referrerId",
    checked: false,
    width: "80px",
  },
  {
    title: "用户ID",
    dataIndex: "userId",
    checked: true,
    width: "80px",
  },
  {
    title: "名称/状态/运营商",
    dataIndex: "nodeName",
    scopedSlots: { customRender: "nodeName" },
    checked: true,
    width: "240px",
  },
  {
    title: "调度模式",
    dataIndex: "schedule",
    scopedSlots: { customRender: "schedule" },
    checked: true,
    width: "180px",
  },
  {
    title: "地域",
    dataIndex: "province",
    scopedSlots: { customRender: "province" },
    checked: true,
    width: "120px",
  },
  {
    title: "收益",
    dataIndex: "profitYesterday",
    scopedSlots: { customRender: "profitYesterday" },
    checked: true,
    width: "150px",
  },
  {
    title: "业务/上游",
    dataIndex: "business.name",
    scopedSlots: { customRender: "business.name" },
    checked: true,
    width: "120px",
  },
  {
    title: "最近利用率",
    dataIndex: "lastDayUpUsage",
    scopedSlots: { customRender: "lastDayUpUsage" },
    checked: true,
    width: "60px",
  },
  {
    title: "上行",
    dataIndex: "bwNum",
    scopedSlots: { customRender: "bwNum" },
    checked: true,
    width: "110px",
  },
  {
    title: "BOSS/会员结算周期",
    dataIndex: "business",
    scopedSlots: { customRender: "business" },
    checked: true,
    width: "110px",
  },
  {
    title: "mac地址",
    dataIndex: "macAddress",
    checked: false,
  },
  {
    title: "备注",
    dataIndex: "remark",
    checked: false,
  },
  {
    title: "创建/计费时间",
    dataIndex: "createdAt",
    scopedSlots: { customRender: "createdAt" },
    checked: true,
    width: "150px",
  },
  {
    title: "最近在线时间",
    dataIndex: "updatedAt",
    checked: true,
    width: "150px",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "120px",
    fixed: "right",
    scopedSlots: { customRender: "action" },
    checked: true,
  },
];
// 收益表格字段
const settledColumns = [
  {
    title: "日期",
    dataIndex: "settle.day",
    scopedSlots: { customRender: "day" },
    width: "100px",
  },
  {
    title: "计费流量",
    dataIndex: "settle.flow",
    scopedSlots: { customRender: "flow" },
    width: "100px",
  },
  {
    title: "上游月单价",
    dataIndex: "settle.supMonthPrice",
    width: "90px",
  },
  {
    title: "设置月单价",
    dataIndex: "settle.manageMonthPrice",
    width: "90px",
  },
  {
    title: "原始结算金额",
    dataIndex: "settle.supOriginAmount",
    width: "90px",
  },
  {
    title: "补贴金额",
    dataIndex: "settle.supBonusAmount",
    width: "90px",
  },
  {
    title: "sla扣减金额",
    dataIndex: "settle.supSlaDeductAmount",
    width: "90px",
  },
  {
    title: "上游结算金额",
    dataIndex: "settle.supSettleAmount",
    width: "90px",
  },
  {
    title: "用户结算金额",
    dataIndex: "settle.userSettleAmount",
    width: "90px",
  },
  {
    title: "结算收益",
    dataIndex: "settle.settleRofit",
    width: "90px",
  },
  {
    title: "管理端单价抽成/收益",
    dataIndex: "settle.manageDeductPrice",
    scopedSlots: { customRender: "manageDeductPrice" },
    width: "100px",
  },
  {
    title: "管理端流量抽成/流量/收益",
    dataIndex: "settle.manageDeductFlow",
    scopedSlots: { customRender: "manageDeductFlow" },
    width: "170px",
  },
  {
    title: "管理端总收益",
    dataIndex: "settle.manageTotalProfit",
    width: "90px",
  },
  {
    title: "boss流量/收益",
    dataIndex: "settleBoss.flow",
    scopedSlots: { customRender: "bossFlow" },
    width: "120px",
  },
  {
    title: "boss单价抽成/佣金",
    dataIndex: "settleBoss.deductPrice",
    scopedSlots: { customRender: "bossDeductPrice" },
    width: "120px",
  },
  {
    title: "boss流量抽成/流量/佣金",
    dataIndex: "settleBoss.deductFlow",
    scopedSlots: { customRender: "bossDeductFlow" },
    width: "150px",
  },
  {
    title: "boss结算状态",
    dataIndex: "settleBoss.status",
    scopedSlots: { customRender: "bossSettleStatus" },
    width: "200px",
  },
  {
    title: "代理商单价抽成/佣金",
    dataIndex: "settleAgent.deductPrice",
    scopedSlots: { customRender: "agentDeductPrice" },
    width: "110px",
  },
  {
    title: "代理商流量抽成/流量/佣金",
    dataIndex: "settleAgent.deductFlow",
    scopedSlots: { customRender: "agentDeductFlow" },
    width: "150px",
  },
  {
    title: "代理商结算状态",
    dataIndex: "settleAgent.status",
    scopedSlots: { customRender: "agentSettleStatus" },
    width: "200px",
  },
  {
    title: "推荐人流量抽成/流量/佣金",
    dataIndex: "settleReferrer",
    scopedSlots: { customRender: "referrerDeductFlow" },
    width: "150px",
  },
  {
    title: "推荐人结算状态",
    dataIndex: "settleReferrer.status",
    scopedSlots: { customRender: "referrerSettleStatus" },
    width: "200px",
  },
  {
    title: "会员流量/收益",
    dataIndex: "settleUser.flow",
    scopedSlots: { customRender: "userFlow" },
    width: "150px",
  },
  {
    title: "用户结算状态",
    dataIndex: "settleUser.status",
    scopedSlots: { customRender: "userSettleStatus" },
    width: "200px",
  },
];
// 表格拦数据 localStorage名称，保证每个页面都是唯一的
const columnslocalStorage = "NodeListColumns21";

export default {
  name: "NodeList",
  components: {
    STable,
    Ellipsis,
    CreateForm,
    CreateInfoModel,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    VueClipboards,
    UchartsLine,
    DescriptionCard,
    NetworkPressureInfo,
    DialInfoDrawer,
    EditNodeDrawer,
    AddDeviceDrawer,
    DetectConnectivityDrawer,
    LineConfigDrawer,
    ModifyLineDrawer,
  },
  data() {
    // 表格列的配置
    this.columns = columns;
    return {
      // 页面是否显示
      pageShow: true,
      // 分页数组
      pagination: {
        pageSizeOptions: ["10", "30", "50", "70", "100", "150", "200"],
        showTotal: (total) => `共 ${total} 条数据`,
      },
      // 使用的表格栏数据
      columnsData: [],
      // 筛选列对象,data=数据,visible=是否显示筛选列(如果不显示，使用columns显示全部表格数据),model=菜单是否显示
      screenColumns: { data: [], visible: true, model: false },
      // 搜索 展开/收起
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // 每次加载删除选择中值
        this.selectedRowKeys = [];
        this.selectedRows = [];
        // 分页请求参数
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        // 分页
        return Page(requestParameters).then((res) => {
          if (isPageResult(res)) {
            return res.result;
          }
        });
      },
      // 选中项的 key 数组
      selectedRowKeys: [],
      // 选中项数组添加到 selectedRows 中
      selectedRows: [],
      timeStampToFormatDate,
      visible: false,
      model: null,
      moment,
      // 节点详情显示与隐藏
      nodeDetailsVisible: false,
      // 节点详情激活的tab
      nodeDetailsActiveKey: 0,
      multi,
      div,
      // 结算记录数据
      settleData: [],
      settledColumns,
      // 节点清退Visible
      repelVisible: false,
      // 是否为其他
      isOther: false,
      /**
       * 监控选中值
       */
      monitorSelect: 0,
      // 调度配置表格数据
      scheduleFormData: {
        id: 0,
        isTransProv: 0,
        transProvRate: null,
      },
      // 调度跳转表单校验规则
      scheduleRules: {
        isTransProv: [{ required: true, message: "请选择是否支持跨省调度!" }],
        transProvRate: [
          { required: true, message: "请输入调度比例!" },
          {
            pattern: /^([1-9]|[1-9]\d|100)$/,
            message: "只能输入1到100",
            trigger: "change",
          },
        ],
      },
      isModifySchedule: false,
      // 资源监控数据
      monitorLogsData: {},
      // 监控加载中
      monitorSpinning: true,
      // 节点详情数据
      nodeDetailsData: {},
      // 网络压测结果信息
      networkPressureData: {},
      // 压测加载中
      networkPressureSpinning: true,
      dialInfoOpen: false,
      // ...其他数据
      editDrawerVisible: false,
      currentEditRecord: null,
      addDrawervisible: false,
      deviceId: "",
      detectConnectivityVisible: false,
      detectConnectivityId: 0,
      // 线路配置展示状态
      lineConfigVisible: false,
      lineConfigId: 0,
      // 拨号方式
      dialMode: "",
      eths: [],
      // 调整线路展示状态
      modifyLineVisible: false,
      modifyLineId: 0,
    };
  },
  // el 创建前
  beforeCreate() {
    // 创建表单
    this.form = this.$form.createForm(this);

    // 创建节点清退表单
    this.repelForm = this.$form.createForm(this);
  },
  created() {
    // 初始化表格列数据
    this.initColumnsData();
  },
  computed: {
    // 表格选择功能的配置
    rowSelection() {
      return {
        // 指定选中项的 key 数组，需要和 onChange 进行配合
        selectedRowKeys: this.selectedRowKeys,
        // 选中项发生变化时的回调
        onChange: this.onSelectChange,
      };
    },
    handleChange() {},
  },
  methods: {
    // 刷新
    refresh() {
      this.pageShow = false;
      this.$nextTick(function () {
        this.pageShow = true;
        this.selectedRowKeys = [];
        this.selectedRows = [];
        this.queryParam = {};
      });
    },
    /**
     * @description: 表格选中状态改变执行
     * @param {*}
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      // 设置选中k值
      this.selectedRowKeys = selectedRowKeys;
      // 设置选中行数据
      this.selectedRows = selectedRows;
    },
    /**
     * 搜索展开收起切换
     */
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    /**
     * 初始化表格列数据
     */
    initColumnsData() {
      this.screenColumns.data =
        localStorage.getItem(columnslocalStorage) === null
          ? columns
          : JSON.parse(localStorage.getItem(columnslocalStorage));
      // 获取表格列数据
      const createColumnsData = this.createColumnsData(this.screenColumns.data);
      // 判断是否使用筛选列功能，真使用，假不使用
      this.columnsData = this.screenColumns.visible ? createColumnsData : columns;
    },
    /**
     *  保存表格栏数据到localStorage，并且把新的数据赋值给columnsData
     * @param {*} index 索引
     * @param {*} item 列对象
     */
    saveScreenColumns(index, item) {
      // 设置checked值
      item.checked = !item.checked;
      // 筛选列数据赋值给data
      const data = this.screenColumns.data;
      // 设置当选索引表格栏数据
      data[index] = item;
      // 把表格栏数据保存到localStorage中
      localStorage.setItem(columnslocalStorage, JSON.stringify(data));
      // 保存数据后，把更改后的数据重新赋值给columnsData
      this.columnsData = this.createColumnsData(data);
    },
    /**
     * 按筛选列数据checked为真，生成新表格列数据
     * @param {*} screenColumns 筛选列数据
     */
    createColumnsData(screenColumns) {
      var data = [];
      // 遍历筛选列数据
      screenColumns.forEach((item) => {
        // 判断checked为真
        if (item.checked) {
          // 添加到数组里
          data.push(item);
        }
      });
      return data;
    },
    /**
     * 关闭节点详情抽屉
     */
    onNodeDetailsClose() {
      this.nodeDetailsVisible = false;
    },

    /**
     * 点击节点详情
     */
    async onNodeDetails(record) {
      this.nodeDetailsActiveKey = 0;
      const { result } = await GetNodeDetails(record.id);
      this.nodeDetailsData = result;
      // 获取节点详情
      const res = await Details(record.id);
      if (res.code !== 0) {
        return;
      }
      // 获取结算记录
      this.settleData = res.result.settleList;
      // 弹出抽屉
      this.nodeDetailsVisible = true;
      // 设置调度配置值
      this.scheduleFormData.id = record.id;
      this.scheduleFormData.isTransProv = record.isTransProv;
      this.scheduleFormData.transProvRate = record.transProvRate;
      // 执行带宽图表
      this.onMonitor(0);
      // 监控选择项设置第一个
      this.monitorSelect = 0;
    },
    /**
     * 删除
     */
    remove() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      const ids = [];
      this.selectedRows.map((item) => {
        ids.push(item.id);
      });
      const self = this;
      this.$confirm({
        title: "您确定要删除商品?",
        content: (h) => (
          <div style="color:red;">正在删除{self.selectedRows.length}条记录</div>
        ),
        onOk() {
          return new Promise((resolve) => {
            // 通过URLSearchParams组装请求参数
            var form1 = new URLSearchParams();
            form1.append("ids[]", ids);
            Remove(form1)
              .then((response) => {
                if (handlerResult(response)) {
                  // 刷新表格
                  self.$refs.table.refresh();
                }
              })
              .catch((err) => {
                self.$message.error(err + "");
              })
              .finally(() => {
                resolve();
              });
          });
        },
        class: "test",
      });
    },
    /**
     * 返回结算名称
     * @param {string} value 结算周期编码
     */
    periodName(value) {
      let name = "-";
      if (value === "MANUAL") {
        name = "手动";
      } else if (value === "DAY") {
        name = "日结";
      } else if (value === "WEEK") {
        name = "周结";
      } else if (value === "MONTH") {
        name = "月结";
      }
      return name;
    },
    /**
     * 弹窗关闭
     */
    handleCancel() {
      this.visible = false;
    },
    /**
     * 弹窗确定
     */
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields(async (errors, values) => {
        if (!errors) {
          if (values.method === "add") {
            // 添加
            Add(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "edit") {
            values.provinceCode = values.area[0];
            values.cityCode = values.area[1];
            // 编辑
            Edit(values).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "transfer") {
            /**转移节点 */
            const ids = [];
            // 遍历选中的行
            this.selectedRows.map((item) => {
              // 获取id，添加到id数组中
              ids.push(item.id);
            });
            var param = new URLSearchParams();
            param.append("id[]", ids);
            param.append("userId", values.userId);
            // 转移
            NodeTransfer(param).then((response) => {
              if (handlerResult(response)) {
                // 刷新表格
                this.$refs.table.refresh();
                this.visible = false;
              }
            });
          } else if (values.method === "manualSettle") {
            values.dateStr = moment(values.dateStr).format("YYYY-MM-DD");
            // 编辑
            ManualSettle(values).then((response) => {
              if (handlerResult(response)) {
              }
            });
          } else if (values.method === "manualSettleByIds") {
            // 获取节点id数组
            const ids = [];
            // 遍历选中的行
            this.selectedRows.map((item) => {
              // 获取id，添加到id数组中
              ids.push(item.id);
            });
            values.ids = ids;
            values.dateStr = moment(values.dateStr).format("YYYY-MM-DD");
            // values转换UrlSearchParams
            var param = new URLSearchParams();
            param.append("ids[]", ids);
            param.append("dateStr", values.dateStr);
            // 编辑
            ManualSettleByIds(param).then((response) => {
              if (handlerResult(response)) {
              }
            });
          }
        }
      });
    },
    /**
     * 节点编辑
     */
    onEdit(record) {
      this.currentEditRecord = record;
      this.editDrawerVisible = true;
    },
    /**
     * 点击节点转移
     */
    onNodeTransfer() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.model = {
        title: "节点转移",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "transfer" }],
              },
            ],
          },
          {
            label: "会员ID",
            item: [
              {
                formType: "input",
                col: 24,
                decorator: [
                  "userId",
                  {
                    rules: [{ required: true, message: "节点名称不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 点击手动拉取上游结算数据
     */
    onManualSettle() {
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据
      this.model = {
        title: "拉取上游结算数据",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "manualSettle" }],
              },
            ],
          },
          {
            label: "选择结算时间",
            item: [
              {
                formType: "DatePpicker",
                col: 24,
                placeholder: "请选择时间",
                decorator: [
                  "dateStr",
                  {
                    rules: [{ required: true, message: "结算时间不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    onManualSettleByIds(){
      if (this.selectedRows.length === 0) {
        this.$message.error("请至少选择一个,再操作");
        return;
      }
      this.visible = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据
      this.model = {
        title: "拉取节点上游结算数据",
        data: [
          {
            label: "",
            notVshow: true,
            item: [
              {
                formType: "input",
                decorator: ["method", { initialValue: "manualSettleByIds" }],
              },
            ],
          },
          {
            label: "结算时间",
            item: [
              {
                formType: "DatePpicker",
                col: 24,
                placeholder: "请选择时间",
                decorator: [
                  "dateStr",
                  {
                    rules: [{ required: true, message: "结算时间不能为空" }],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    /**
     * 节点清退弹窗关闭
     */
    repelHandleCancel() {
      // 关闭弹窗
      this.repelVisible = false;
    },
    /**
     * 节点清退确认操作
     */
    async repelHandleOk() {
      const form = this.repelForm;
      form.validateFields(async (errors, values) => {
        if (!errors) {
          // 打印提交数据
          // console.log(values);
          const res = await Repel(values);
          if (handlerResult(res)) {
            // 刷新表格
            this.$refs.table.refresh();
            this.repelVisible = false;
          }
        }
      });
    },
    onChangeReason(value) {
      this.isOther = value === "其他";
    },
    /**
     * 节点清退
     */
    onRepel(record) {
      const form = this.repelForm;
      form.resetFields(); // 清理表单数据
      this.repelVisible = true;
      // 设置表单id，延迟
      setTimeout(() => {
        // 设置表单数据
        this.repelForm.setFieldsValue({
          id: record.id,
        });
      }, 100);
    },
    /**
     * 获取监控信息
     * @param {*} id
     * @param {*} startTime
     * @param {*} endTime
     */
    async getMonitorLogs(id, startTime, endTime) {
      // 监控加载中
      this.monitorSpinning = true;
      // 获取监控信息
      const { result } = await GetMonitorLogs({
        id: id,
        startTime: startTime,
        endTime: endTime,
      });
      // 监控加载完成
      this.monitorSpinning = false;
      // 时间数组
      if (result !== null) {
        this.monitorLogsData = result;
      }
    },
    /**
     * 获取监控信息
     * @param {*} value 0为近6小时，1为近24小时，2为昨天，3为近3天
     */
    onMonitor(value) {
      let start = "";
      // 获取当前时间作为结束时间
      let end = dayjs().format("YYYY-MM-DD HH:mm:ss");
      if (value === 0) {
        // 获取6小时前的时间
        start = dayjs().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss");
      } else if (value === 1) {
        // 获取24小时前的时间
        start = dayjs().subtract(24, "hour").format("YYYY-MM-DD HH:mm:ss");
      } else if (value === 2) {
        // 获取昨天的开始时间（00:00:00）
        start = dayjs().subtract(1, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss");
        // 获取昨天结束时间
        end = dayjs().subtract(1, "day").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      } else if (value === 3) {
        // 获取今天开始时间00:00:00
        start = dayjs().subtract(2, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss");
      }
      this.getMonitorLogs(this.nodeDetailsData.id, start, end);
    },
    // 点击调度调整
    async onSchedule() {
      this.$refs.scheduleRef.validate(async (valid) => {
        if (valid) {
          const res = await ModifySchedule(this.scheduleFormData);
          if (res.code === 0) {
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    // 获取网络压测结果信息
    async getNetworkPressure() {
      this.networkPressureSpinning = true;
      this.networkPressureData = undefined;
      const { result } = await GetNetworkPressure(this.nodeDetailsData.id);
      this.networkPressureSpinning = false;
      this.networkPressureData = result;
    },
    // 点击压测
    async handleNetworkPressure() {
      const res = await SendNetworkPressure(this.nodeDetailsData.id);
      if (res.code === 0) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.message);
      }
    },
    /**
     * 点击tabs
     */
    onNodeDetailsTabChange(e) {
      if (e === 4) {
        // 点击tabs 获取网络压测结果信息
        this.getNetworkPressure();
      }
    },
    onDialInfoDrawer() {
      this.dialInfoOpen = true;
    },
    // 添加设备
    onAdd() {
      this.addDrawervisible = true;
    },
    handleClose() {
      this.addDrawervisible = false;
    },
    handleSuccess(result) {
      // 刷新表格
      this.$refs.table.refresh();
      this.onDetectConnectivity(result.id, result.dialMode);
      // Handle successful device addition
      // console.log("Device added:", result);
    },
    // 打开设备信息抽屉
    onDetectConnectivity(id, dialMode) {
      console.log("onDetectConnectivity:", id, dialMode);

      this.detectConnectivityId = id;
      this.dialMode = dialMode;
      this.detectConnectivityVisible = true;
    },
    // 连接测试关闭
    handleDetectConnectivityClose() {
      this.detectConnectivityVisible = false;
    },
    // 连接测试成功
    handleDetectConnectivitySuccess() {
      // 刷新表格
      this.$refs.table.refresh();
    },
    // 拨号操作
    handleDial(id, dialMode, eths) {
      // 刷新表格
      this.$refs.table.refresh();
      this.lineConfigId = id;
      this.dialMode = dialMode;
      this.eths = eths;
      this.lineConfigVisible = true;
      this.handleDetectConnectivityClose();
    },
    // 调整线路操作
    handleModifyLineClick(id, dialMode) {
      this.modifyLineId = id;
      this.dialMode = dialMode;
      this.modifyLineVisible = true;
      // 关闭拨号信息抽屉
      this.dialInfoOpen = false;
    },
    // 线路配置成功
    handleLineConfigSuccess() {
      this.handleLineConfigClose();
    },
    // 关闭线路配置
    handleLineConfigClose() {
      this.lineConfigVisible = false;
    },
    // 线路调整
    handleModifyLineSuccess() {
      this.handleModifyLineClose();
    },
    // 关闭线路调整
    handleModifyLineClose() {
      this.modifyLineVisible = false;
    },
  },
};
</script>
<style scoped>
.color-red {
  color: red;
}
.disk-info {
  margin-top: 20px;
  color: #252525;
  font-size: 16px;
  /** 字体加粗 */
  font-weight: 600;
}
</style>
