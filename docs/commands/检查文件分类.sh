#!/bin/bash

# 📏 项目文件分类检查脚本
# 用于检查项目文件是否符合分类规则

echo "🔍 正在检查项目文件分类..."
echo "================================"

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
violations=0
warnings=0

echo -e "${BLUE}📂 检查根目录文件...${NC}"

# 检查根目录是否有不应该存在的文件
echo "根目录文件检查："

# 检查临时文件
temp_files=$(find . -maxdepth 1 -name "*.tmp" -o -name "*.temp" -o -name "*.bak" -o -name "*.old" 2>/dev/null)
if [ ! -z "$temp_files" ]; then
    echo -e "${RED}❌ 发现临时文件（应删除）:${NC}"
    echo "$temp_files"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ 无临时文件${NC}"
fi

# 检查日志文件
log_files=$(find . -maxdepth 1 -name "*.log" 2>/dev/null)
if [ ! -z "$log_files" ]; then
    echo -e "${RED}❌ 发现日志文件（应删除或移动）:${NC}"
    echo "$log_files"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ 无日志文件${NC}"
fi

# 检查多余的markdown文件（除了README.md，其他.md文件都应该在docs/目录）
extra_md=$(find . -maxdepth 1 -name "*.md" ! -name "README.md" ! -name ".*" 2>/dev/null)
if [ ! -z "$extra_md" ]; then
    echo -e "${YELLOW}⚠️  发现可能应该移动到docs/的markdown文件:${NC}"
    echo "$extra_md"
    warnings=$((warnings + 1))
fi

# 检查根目录文件数量
root_files=$(find . -maxdepth 1 -type f ! -name ".*" | wc -l | tr -d ' ')
echo "根目录文件总数: $root_files"
if [ $root_files -gt 15 ]; then
    echo -e "${YELLOW}⚠️  根目录文件较多（$root_files个），建议检查是否有文件需要移动${NC}"
    warnings=$((warnings + 1))
else
    echo -e "${GREEN}✅ 根目录文件数量合理${NC}"
fi

echo ""
echo -e "${BLUE}📚 检查文档结构...${NC}"

# 检查docs目录结构
if [ -d "docs" ]; then
    echo "文档目录结构："
    
    # 检查是否有文档文件直接在docs根目录
    docs_root_files=$(find docs/ -maxdepth 1 -type f -name "*.md" ! -name "README.md" ! -name "📋整理报告.md" 2>/dev/null)
    if [ ! -z "$docs_root_files" ]; then
        echo -e "${YELLOW}⚠️  docs/根目录有应该分类的文档:${NC}"
        echo "$docs_root_files"
        warnings=$((warnings + 1))
    else
        echo -e "${GREEN}✅ docs/目录结构良好${NC}"
    fi
    
    # 检查必要的子目录是否存在
    required_dirs=("commands" "deployment" "rules")
    for dir in "${required_dirs[@]}"; do
        if [ -d "docs/$dir" ]; then
            echo -e "${GREEN}✅ docs/$dir/ 存在${NC}"
        else
            echo -e "${RED}❌ docs/$dir/ 目录缺失${NC}"
            violations=$((violations + 1))
        fi
    done
else
    echo -e "${RED}❌ docs/目录不存在${NC}"
    violations=$((violations + 1))
fi

echo ""
echo -e "${BLUE}⚙️  检查配置文件...${NC}"

# 检查是否有重复的配置文件
duplicate_configs=""

# 检查ESLint配置
eslint_configs=$(find . -maxdepth 1 -name ".eslintrc*" 2>/dev/null)
if [ ! -z "$eslint_configs" ]; then
    echo -e "${RED}❌ 发现过时的ESLint配置文件:${NC}"
    echo "$eslint_configs"
    echo "应该只使用 eslint.config.js"
    violations=$((violations + 1))
fi

# 检查JS配置文件
if [ -f "jsconfig.json" ]; then
    echo -e "${RED}❌ 发现jsconfig.json（应使用tsconfig.json）${NC}"
    violations=$((violations + 1))
fi

echo ""
echo -e "${BLUE}🧪 检查源代码结构...${NC}"

if [ -d "src" ]; then
    # 检查src目录中是否有配置文件
    src_configs=$(find src/ -name "*.config.*" -o -name ".*rc*" 2>/dev/null)
    if [ ! -z "$src_configs" ]; then
        echo -e "${YELLOW}⚠️  src/目录中发现配置文件:${NC}"
        echo "$src_configs"
        warnings=$((warnings + 1))
    else
        echo -e "${GREEN}✅ src/目录结构良好${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  src/目录不存在${NC}"
    warnings=$((warnings + 1))
fi

echo ""
echo "================================"
echo -e "${BLUE}📊 检查结果统计${NC}"
echo "================================"

if [ $violations -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 恭喜！项目文件分类完全符合规范！${NC}"
    echo -e "${GREEN}✅ 违规文件: 0${NC}"
    echo -e "${GREEN}✅ 警告项目: 0${NC}"
elif [ $violations -eq 0 ]; then
    echo -e "${YELLOW}⚠️  项目结构基本符合规范，但有一些建议改进的地方${NC}"
    echo -e "${GREEN}✅ 违规文件: 0${NC}"
    echo -e "${YELLOW}⚠️  警告项目: $warnings${NC}"
else
    echo -e "${RED}❌ 发现文件分类违规！请立即整改${NC}"
    echo -e "${RED}❌ 违规文件: $violations${NC}"
    echo -e "${YELLOW}⚠️  警告项目: $warnings${NC}"
fi

echo ""
echo -e "${BLUE}📖 参考文档:${NC}"
echo "- 详细分类规则: docs/rules/📏文件分类规则.md"
echo "- 文档索引: docs/README.md"
echo "- 项目说明: README.md"

echo ""
if [ $violations -gt 0 ]; then
    echo -e "${RED}💡 建议: 立即查看 docs/rules/📏文件分类规则.md 并整改违规文件${NC}"
    exit 1
elif [ $warnings -gt 0 ]; then
    echo -e "${YELLOW}💡 建议: 查看 docs/rules/📏文件分类规则.md 并考虑优化警告项目${NC}"
    exit 0
else
    echo -e "${GREEN}💡 太棒了！继续保持良好的文件管理习惯！${NC}"
    exit 0
fi 