package com.sup.controller.manage;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.sup.response.NodeDetailsResp;
import com.sup.response.PageResult;
import com.sup.response.RespResult;
import com.sup.response.ResultStatus;
import com.sup.response.SettleResp;
import com.sup.service.BusinessService;
import com.sup.service.NodeOperateService;
import com.sup.service.NodeService;
import com.sup.service.SettleAgentService;
import com.sup.service.SettleBossService;
import com.sup.service.SettleReferrerService;
import com.sup.service.SettleService;
import com.sup.service.SettleUserService;
import com.sup.upstream.api.qiniu.NodeInterfacesResponse;
import com.sup.upstream.api.qiniu.QualityreportResponse;
import com.sup.util.EnumConverterUtil;
import com.sup.util.StringUtil;
import com.sup.util.Util;
import com.sup.vo.BusinessManageVO;
import com.sup.vo.NodeManageVO;


import com.sup.config.exception.RespCodeEnum;
import com.sup.config.exception.ResponseResultException;
import com.sup.dto.DetectConnectivityDTO;
import com.sup.dto.DialTestResultDTO;
import com.sup.dto.LinesConvergeDTO;
import com.sup.dto.MonitorLogsDTO;
import com.sup.dto.NetworkPressureResultDTO;
import com.sup.dto.NodeBindDTO;
import com.sup.dto.NodeBindResultDTO;
import com.sup.dto.NodeDetailsDTO;
import com.sup.dto.NodeQueryDTO;
import com.sup.dto.SupportPreDialTsetDTO;
import com.sup.entity.Business;
import com.sup.entity.Node;
import com.sup.entity.Settle;
import com.sup.enums.DialModeEnum;
import com.sup.enums.IspEnum;
import com.sup.enums.NatTypeEnum;
import com.sup.enums.NodeStageEnum;
import com.sup.param.NodeEditParam;

/**
* 节点列表信息
* @author 张辉
* @date 2024-04-19 22:07:12
* @version V1.0
*/
@RestController
@ResponseBody
@RequestMapping("/main/node/list/")
public class ManageNodeListController {

    @Autowired
    private NodeService nodeService;
    @Autowired
    private BusinessService businessService;
    @Autowired
    private SettleService settleService;
    @Autowired
    private SettleBossService settleBossService;
    @Autowired
    private SettleAgentService settleAgentService;
    @Autowired
    private SettleReferrerService settleReferrerService;
    @Autowired
    private SettleUserService settleUserService;
    @Autowired
    private NodeOperateService nodeOperateService;
     
    /**
	 * 获取运营商
	 * @Title: getIsp
	 * @return RespResult<List<Map<String,Object>>>
	 * @date 2024年6月7日 上午8:07:52
	 */
	@GetMapping("getIsp")
	public RespResult<List<Map<String, Object>>> getIsp() {
		return RespResult.success(EnumConverterUtil.convertEnumToMap(IspEnum.class));
	}

	/**
	 * 获取网络类型
	 * @Title: getNatType
	 * @return RespResult<List<Map<String,Object>>>
	 * @date 2024年6月12日 上午6:38:02
	 */
	@GetMapping(value = "getNatType")
	public RespResult<List<Map<String, Object>>> getNatType() {
		return RespResult.success(EnumConverterUtil.convertEnumToMap(NatTypeEnum.class));
	}
	
	/**
	 * 拨号方式
	 * @Title: getDialMode
	 * @return RespResult<List<Map<String,Object>>>
	 * @date 2024年6月12日 上午11:08:47
	 */
	@GetMapping(value = "getDialMode")
	public RespResult<List<Map<String, Object>>> getDialMode() {
		return RespResult.success(EnumConverterUtil.convertEnumToMap(DialModeEnum.class));
	}
	
    /**
	 * 添加节点
	 * 
	 * @Title: add
	 * @param req
	 * @param bindingResult
	 * @return RespResult<Boolean>
	 * @date 2024年6月23日 23:18:17
	 */
	@PostMapping("add")
	public RespResult<NodeBindResultDTO> add(@Valid @RequestBody NodeBindDTO nodeBindDTO, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, Util.bindingResultError(bindingResult));
		}
		NodeBindResultDTO nodeBind = nodeOperateService.nodeBind(nodeBindDTO);
		return RespResult.success(nodeBind);
	}
	
	/**
	 * 提交拨号信息
	 * 
	 * @Title: dialSubmit
	 * @param nodeId
	 * @param dialSubmitParam
	 * @return RespResult<DialSubmitParam>
	 * @date 2024年9月21日 20:26:40
	 */
	@GetMapping(value = "dialSubmit/{id}")
	public RespResult<String> dialSubmit(@PathVariable("id") Long id) {
		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}
		
		nodeOperateService.dialSubmit(getNode);
		return RespResult.success();
	}
	
	/**
	 * 测试连接
	 * 
	 * @Title: detectConnectivity
	 * @param nodeId
	 * @param businessCategoryId
	 * @return RespResult<DetectConnectivityDTO>
	 * @date 2025年3月5日 16:39:24
	 */
	@GetMapping("/detectConnectivity/{id}")
	public RespResult<DetectConnectivityDTO> detectConnectivity(@PathVariable Long id) {
		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}

		return RespResult
				.success(nodeOperateService.detectConnectivity(getNode));
	}
	
	/**
	 * 按节点id查询是否支持上机前拨号测试和网络压测
	 * @Title: supportPreDialTset
	 * @param id
	 * @return RespResult<SupportPreDialTsetDTO>
	 * @date 2025年6月7日 00:03:32
	 */
	@GetMapping(value = "supportPreDialTset/{id}")
	public RespResult<SupportPreDialTsetDTO> supportPreDialTset(@PathVariable("id") Long id) {
		if (id == null) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "参数错误");
		}

		Node getNode = nodeService.getById(id);
		// 判断节点属于用户的
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}
		return RespResult.success(nodeOperateService.supportPreDialAndNetworkTset(getNode));
	}

	/**
	 * 按节点id查询是否需要配置dhcp
	 * @param id
	 * @return
	 */
    @GetMapping(value = "isDhcpNeedConfig/{id}")
	public RespResult<Boolean> isDhcpNeedConfig(@PathVariable("id") Long id) {
		if (id == null) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "参数错误");
		}

		Node getNode = nodeService.getById(id);
		// 判断节点属于用户的
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}
		return RespResult.success(nodeOperateService.isDhcpNeedConfig(getNode));
	}
	/**
	 * 获取网卡信息
	 * 
	 * @Title: getNetCard
	 * @param nodeId
	 * @return RespResult<NodeInterfacesRes>
	 * @date 2024年9月19日 19:08:09
	 */
	@GetMapping(value = "getNetCard/{id}")
	public RespResult<List<NodeInterfacesResponse>> getNetCard(@PathVariable("id") Long id) {
		
		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}

		List<NodeInterfacesResponse> getNetCard = nodeOperateService.getNetCard(getNode);
		return RespResult.success(getNetCard);
	}
	
	/**
	 * 拨号测试
	 * 
	 * @Title: detectNetwork
	 * @param id
	 * @param dialDetail
	 * @return RespResult<List<DetectNetworkResult>>
	 * @date 2025年3月13日 11:09:23
	 */
	@GetMapping("/dialTest/{id}")
	public RespResult<List<DialTestResultDTO>> dialTest (@PathVariable Long id) {

		Node getNode = nodeService.getById(id);
		// 判断节点属于用户的
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}

		return RespResult.success(nodeOperateService.dialTest(getNode));
	}

	
    /**
     *  获取节点详情
     * @Title: details
     * @param nodeId
     * @return RespResult<QualityreportRes>
     * @date 2024年8月12日 10:57:12
     */
    @RequestMapping(value = "details/{nodeId}")
    public RespResult<NodeDetailsResp> details(@PathVariable("nodeId") Long nodeId) {
    	// 查询节点
    	Node getNode = nodeService.getById(nodeId);
    	if(Objects.isNull(getNode)) {
    		throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
    	}

    	Settle settle = new Settle();
    	settle.setNodeId(nodeId);
    	// 基础结算集合
    	List<Settle> settleList = settleService.list(settle);
    	// 返回到前端新创建集合
    	List<SettleResp> newList = new ArrayList<>(settleList.size());
    	// 遍历基础结算集合
    	for (Settle s : settleList) {
    		// 结算对象
    		SettleResp settleObj = new SettleResp();
    		// 设置基础结算
    		settleObj.setSettle(s);
    		// 设置boss结算
    		settleObj.setSettleBoss(this.settleBossService.getBySettleId(s.getId()));
    		// 设置代理商结算对象
    		settleObj.setSettleAgent(this.settleAgentService.getBySettleId(s.getId()));
    		// 设置推荐人结算
    		settleObj.setSettleReferrer(this.settleReferrerService.getBySettleId(s.getId()));
    		// 设置用户结算
    		settleObj.setSettleUser(this.settleUserService.getBySettleId(s.getId()));
    		// 添加到集合
    		newList.add(settleObj);
		}

		NodeDetailsResp nodeDetails = new NodeDetailsResp();
		BeanUtils.copyProperties(getNode, nodeDetails);
		// 设置节点信息
    	// nodeDetails.setNode(Util.entityToModel(getNode, NodeManageVO.class));
    	// 设置结算信息
    	nodeDetails.setSettleList(newList);
    	
    	QualityreportResponse getQualityreportRes = nodeOperateService.getQualityreport(getNode);
    	if(getQualityreportRes != null) {
    		// 设置质量报告
    		nodeDetails.setQualityreport(nodeOperateService.getQualityreport(getNode));
    	}

		// 判断x86类型,设置拨号状态统计
    	/*
		if(DeviceTypeEnum.X86.name().equals(getNode.getDeviceType())) {
			// 设置拨号状态统计
			nodeDetails.setDialStat(this.dialSatusStat(getNode));
		}
		*/
		// 设置当天网络压测次数
		nodeDetails.setNetPressureNum(nodeOperateService.getNetworkpressureNum(nodeId));
		// 设置压测状态
		nodeDetails.setNetBenchStatus(nodeOperateService.getNetBenchStatus(getNode));	
        return RespResult.success(nodeDetails);
    }
    
    /**
	 * 获取节点详情信息
	 * @Title: getNodeDetails
	 * @param id 主键id
	 * @return RespResult<NodeDetailsDTO>
	 * @date 2025年4月1日 22:26:39
	 */
	@GetMapping(value = "getNodeDetails/{id}")
	public RespResult<NodeDetailsDTO> getNodeDetails(@PathVariable("id") Long id) {
		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
		}
		return RespResult.success(nodeOperateService.getNodeDetails(getNode));
	}
    /**
     * 删除
     * @Title: remove
     * @param ids id数组
     * @return RespResult<Object>
     * @date 2024年8月10日 17:09:29
     */
    @RequestMapping(value = "remove", method = RequestMethod.POST)
    public RespResult<Object> remove(@RequestParam(value = "ids[]", required = false, defaultValue = "") long[] ids) {
    	int count = 0;
		String msg = "";
		// 遍历删除id数组
    	for (long i : ids) {
    		// 查询节点
    		Node getNode = nodeService.getById(i);
    		if(Objects.isNull(getNode)) {
    			msg = "节点不存在";
    			continue;
    		}
    		// 判断已提交的节点可以删除，其他阶段类型不能删除
    		if(!NodeStageEnum.SUBMITTED.name().equals(getNode.getStage())) {
    			msg = "阶段类型只有已提交状态才能删除，其他状态无法删除";
    			continue;
    		}
    		// 当前时间
    		LocalDateTime currentTime = LocalDateTime.now();
    		
    		// 使用 Duration 计算两个时间点之间的差异
            Duration duration = Duration.between(getNode.getCreatedAt(), currentTime);
    		// 判断是否超过5分钟,防止客户正在提交节点的时候被删除
            // 获取差异的分钟数（取绝对值）
            long minutesDifference = Math.abs(duration.toMinutes());

    		if(minutesDifference < 5) {
    			msg = "已提交类型的节点超过5分钟后才能删除";
    			continue;
    		}
    		
    		// 执行删除操作
    		if(nodeService.remove(i)) {
    			count++;
    		} else {
    			msg = "删除失败";
    			continue;
    		}
    	}
    	if (count > 0) {
			return RespResult.success("操作成功" + count + "条记录");
		}
		return RespResult.error(RespCodeEnum.CUSTOM_ERROR_DESC, msg);
    }

    /**
    * 分页
    * @Title: page
    * @param nodeQueryDTO
    * @return RespResult<PageResult<NodeManageVO>>
    * @date 2024-04-19 22:07:12
    */
    @GetMapping("/page")
    public RespResult<PageResult<NodeManageVO>> page(NodeQueryDTO nodeQueryDTO) {
    	PageResult<NodeManageVO> pageResult = PageResult
				.result(nodeService.pageQuery(nodeQueryDTO), NodeManageVO.class);
    	// 遍历数据，设置上游名称
    	pageResult.getData().forEach(item -> {
    		// 按业务id查询业务对象
            Business getBusiness = businessService.getById(item.getBusinessId());
            if(Objects.nonNull(getBusiness)) {
            	 // 设置业务名称
            	item.setBusiness(Util.entityToModel(getBusiness, BusinessManageVO.class));
            }
		});
    	return RespResult.success(pageResult);
    }

    /**
     * 节点编辑
     * @Title: edit
     * @param param
     * @param bindingResult
     * @return RespResult<String>
     * @date 2024年10月11日 16:48:09
     */
    @RequestMapping(value = "edit")
    public RespResult<String> edit(@Valid NodeEditParam param, BindingResult bindingResult) {
    	if (bindingResult.hasErrors()) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, Util.bindingResultError(bindingResult));
		}
    	nodeService.edit(param);
    	return RespResult.success("操作成功");
    }
    
    /**
     * 节点转移
     * @Title: nodeTransfer
     * @param id
     * @param userId
     * @return RespResult<String>
     * @date 2024年10月12日 14:59:04
     */
    @RequestMapping(value = "nodeTransfer")
    public RespResult<String> nodeTransfer(@RequestParam(value = "id[]", required = false, defaultValue = "") long[] id,
    		@RequestParam(value = "userId", required = false, defaultValue = "") Long userId) {
    	if(Objects.isNull(userId)) {
    		throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "用户Id不能为空");
    	}
    	int count = 0;
    	String msg = "";
    	for (long i : id) {
    		ResultStatus resultStatus = nodeService.nodeTransfer(null, i, userId);
    		if(resultStatus.isStatus()) {
    			count ++;
    		} else {
    			msg = resultStatus.getMsg();
    		}
		}
        if (count > 0) {
        	return RespResult.success("操作成功" + count + "条记录");
        }
    	return RespResult.error(RespCodeEnum.CUSTOM_ERROR_DESC, msg);
    }
    
    /**
     * 手动拉取上游结算数据
     * @Title: manualSettle
     * @param dateStr
     * @return
     * @throws ParseException RespResult<String>
     * @date 2024年10月12日 19:33:07
     */
    @RequestMapping(value = "manualSettle")
    public RespResult<String> manualSettle(@RequestParam(value = "dateStr", required = false, defaultValue = "") String dateStr) throws ParseException {
        if(Objects.isNull(dateStr)) {
        	throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
        }
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = formatter.parse(dateStr);
        nodeOperateService.incomeSettlement(date);
		return RespResult.success("操作成功");
    }
    
    /**
     * 节点清退
     * @Title: repel
     * @param id 节点id
     * @param reason 清退原因
     * @return RespResult<String>
     * @date 2024年10月26日 15:43:10
     */
    @RequestMapping("repel")
	public RespResult<String> repel(@RequestParam(value = "id") final Long id,
			@RequestParam(value = "reason", required = false, defaultValue = "") final String reason) {
		if(Objects.isNull(id) ) {
			throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
		}
		if(StringUtil.isNullOrEmpty(reason)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC,"清退原因不能为空");
		}
		
		// 查询节点
		Node getNode = nodeService.getById(id);
		if(Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}
		nodeOperateService.repel(getNode, reason);
		return RespResult.success("操作成功");
	}
    
    /**
     * 获取资源监控
     * @Title: getMonitorLogs
     * @param id 节点主键id
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return RespResult<MonitorLogsDTO>
     * @date 2025年3月31日 20:56:00
     */
	@GetMapping("getMonitorLogs")
	public RespResult<MonitorLogsDTO> getMonitorLogs(@RequestParam(value = "id") final Long id,
			@RequestParam(value = "startTime", required = false, defaultValue = "")
	        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") final LocalDateTime startTime,
			@RequestParam(value = "endTime", required = false, defaultValue = "")
	        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") final LocalDateTime endTime) {
		if(Objects.isNull(id) ) {
			throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
		}

		// 查询节点
		Node getNode = nodeService.getById(id);
		if(Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}
		return RespResult.success("操作成功", nodeOperateService.getMonitorLogs(getNode, startTime, endTime));
	}
	/**
	 * 发起网络压测,上机前使用
	 * @Title: sendBeforeBindNetworkPressure
	 * @param sendNetworkPressureDTO
	 * @param bindingResult
	 * @return RespResult<String>
	 * @date 2025年4月10日 22:02:33
	 */
	@GetMapping("sendBeforeBindNetworkPressure/{id}")
	public RespResult<String> sendBeforeBindNetworkPressure(@PathVariable Long id) {

		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}

		nodeOperateService.sendNetworkPressure(getNode, true);
		return RespResult.success("操作成功");
	}
	/**
	 * 获取网络压测信息
	 * @Title: getNetworkPressure
	 * @param id 节点主键id
	 * @return RespResult<NodeDetailsDTO>
	 * @date 2025年4月11日 21:46:12
	 */
	@GetMapping(value = "getNetworkPressure/{id}")
	public RespResult<NetworkPressureResultDTO> getNetworkPressure(@PathVariable("id") Long id) {
		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
		}
		NetworkPressureResultDTO getNetworkPressure = nodeOperateService.getNetworkPressure(getNode);
		return RespResult.success(getNetworkPressure);
	}
	
	/**
	 * 发起网络压测,上机后使用
	 * @Title: sendNetworkPressure
	 * @param id 节点主键id
	 * @return RespResult<String>
	 * @date 2025年4月10日 16:33:21
	 */
	@GetMapping("sendNetworkPressure/{id}")
	public RespResult<String> sendNetworkPressure(@PathVariable("id") Long id) {
		// 查询节点
		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}

		nodeOperateService.sendNetworkPressure(getNode, false);
		return RespResult.success("操作成功");
	}
	
	/**
	 * 节点调度修改
	 * @Title: modifySchedule
	 * @param id
	 * @param isTransProv
	 * @param transProvRate
	 * @return RespResult<Boolean>
	 * @date 2024年12月13日 10:42:32
	 */
	@RequestMapping("modifySchedule")
	public RespResult<Boolean> modifySchedule(@RequestParam(value = "id") final Long id,
			@RequestParam(value = "isTransProv", required = false, defaultValue = "") final Boolean isTransProv,
			@RequestParam(value = "transProvRate", required = false, defaultValue = "") final Integer transProvRate) {
		if(Objects.isNull(id) || Objects.isNull(isTransProv)) {
			throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
		}

		// 查询节点
		Node getNode = nodeService.getById(id);
		if(Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}
		nodeOperateService.schedule(getNode, isTransProv, transProvRate);
		return RespResult.success("操作成功");
	}
	
	/**
     * 获取线路汇聚信息
     * @Title: getLinesConverge
     * @param id
     * @return RespResult<DialInfoDTO>
     * @date 2025年6月17日 21:58:24
     */
    @GetMapping("/getLinesConverge/{id}")
    public RespResult<LinesConvergeDTO> getLinesConverge (@PathVariable Long id) {
        if(id == null) {
    		throw new ResponseResultException(RespCodeEnum.PARAMETER_ERROR);
        }

		Node getNode = nodeService.getById(id);
		if (Objects.isNull(getNode)) {
			throw new ResponseResultException(RespCodeEnum.CUSTOM_ERROR_DESC, "节点不存在");
		}

        return RespResult.success(nodeOperateService.getLinesConverge(getNode));
    }
}
