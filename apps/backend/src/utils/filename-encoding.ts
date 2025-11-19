/**
 * 文件名编码处理工具
 */

/**
 * 修复文件名编码问题
 * 某些浏览器在上传时会使用 Latin-1 编码传输中文文件名
 */
export function fixFilenameEncoding(originalName: string): string {
  if (!originalName) return '';
  
  try {
    // 首先检查是否已经是有效的 UTF-8 编码
    const hasValidChineseChars = /[\u4e00-\u9fff]/.test(originalName);
    
    if (hasValidChineseChars) {
      // 已经包含正确的中文字符，直接返回
      return originalName;
    }
    
    // 检查是否包含乱码字符（通常是编码问题的标志）
    const hasGarbledChars = /[ÿ¿À-ÿ]/.test(originalName);
    
    if (hasGarbledChars) {
      // 尝试从 Latin-1 解码为 UTF-8
      const buffer = Buffer.from(originalName, 'latin1');
      const utf8Name = buffer.toString('utf8');
      
      // 验证转换后是否包含合理的中文字符
      if (/[\u4e00-\u9fff]/.test(utf8Name)) {
        return utf8Name;
      }
    }
    
    // 尝试 URL 解码（处理浏览器自动编码的情况）
    try {
      const decoded = decodeURIComponent(originalName);
      if (decoded !== originalName && /[\u4e00-\u9fff]/.test(decoded)) {
        return decoded;
      }
    } catch {
      // URL 解码失败，继续其他处理
    }
    
    // 所有转换都失败或不需要，返回原始文件名
    return originalName;
  } catch (error) {
    console.warn('文件名编码修复失败:', error);
    return originalName;
  }
}

/**
 * 为下载生成正确的 Content-Disposition 头
 */
export function createContentDispositionHeader(filename: string, inline = false): string {
  const disposition = inline ? 'inline' : 'attachment';
  
  // 使用 RFC 5987 标准编码，同时提供 fallback
  const encodedFilename = encodeURIComponent(filename);
  const asciiFilename = filename.replace(/[^\x00-\x7F]/g, '_'); // ASCII fallback
  
  return `${disposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`;
}

/**
 * 验证文件名是否包含非法字符
 */
export function validateFilename(filename: string): boolean {
  // 检查是否包含路径遍历字符或其他危险字符
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  return !dangerousChars.test(filename);
}