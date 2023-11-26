#!/bin/bash

# 路径和输出文件
FOLDER_PATH="./src"
OUTPUT_FILE="output.md"

# 创建或清空输出文件
> "$OUTPUT_FILE"

# Part 1: 输出目录结构
echo "## Part 1: Project Directory Structure" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
tree "$FOLDER_PATH" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Part 2: 输出源码
echo "## Part 2: Code" >> "$OUTPUT_FILE"
find "$FOLDER_PATH" -type f | while read -r file; do
 # 移除 FOLDER_PATH 部分
    relative_path=$(echo "$file" | sed "s|$FOLDER_PATH/||")
    echo "// $relative_path" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

# 完成提示
echo "Markdown file generated at $OUTPUT_FILE"
