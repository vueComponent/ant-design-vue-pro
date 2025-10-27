/**
 * 统一的百分比处理工具
 */
export class PercentageHelper {
    /**
     * 后端小数转前端百分比显示值
     * @param {number} decimalValue - 后端小数（如0.15）
     * @param {number} decimals - 保留小数位数，默认2位
     * @returns {string} 前端显示的百分比数值（如"15.00"）
     */
    static toDisplay(decimalValue, decimals = 2) {
        if (decimalValue === undefined || decimalValue == null || isNaN(decimalValue)) return '';
        return (decimalValue * 100).toFixed(decimals);
    }
    
    /**
     * 前端百分比转后端小数
     * @param {string|number} percentageValue - 前端百分比数值（如"15"）
     * @returns {number} 后端小数（如0.15）
     */
    static toDecimal(percentageValue) {
        if (percentageValue == null || percentageValue === '') return null;
        const numValue = parseFloat(percentageValue);
        return isNaN(numValue) ? null : numValue / 100;
    }
    
    /**
     * 格式化显示百分比
     * @param {string|number} percentageValue - 百分比数值
     * @returns {string} 格式化后的百分比字符串（如"15.00%"）
     */
    static format(percentageValue) {
        if (percentageValue == null || percentageValue === '') return '-';
        return `${percentageValue}%`;
    }
    
    /**
     * 验证百分比输入是否有效
     * @param {string} inputValue - 用户输入值
     * @returns {boolean} 是否有效
     */
    static isValid(inputValue) {
        if (inputValue === '') return true;
        const numValue = parseFloat(inputValue);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
    }
    
    /**
     * 获取验证错误信息
     * @param {string} inputValue - 用户输入值
     * @returns {string} 错误信息，空字符串表示无错误
     */
    static getValidationError(inputValue) {
        if (inputValue === '') return '请输入百分比';
        const numValue = parseFloat(inputValue);
        if (isNaN(numValue)) return '请输入有效的数字';
        if (numValue < 0) return '百分比不能小于0';
        if (numValue > 100) return '百分比不能大于100';
        return '';
    }
}