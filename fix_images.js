const fs = require('fs');
const file = 'frontend/app.js';
let content = fs.readFileSync(file, 'utf-8');

const oldFunc = `function buildReportImageUrl(imagePath) {
  if (!imagePath) return "";
  return imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
}`;

const newFunc = `function buildReportImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const cleanedPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return \`\${API_BASE}/\${cleanedPath}\`;
}`;

content = content.replace(oldFunc, newFunc);

// Fix the \`/\${buildReportImageUrl(...)}\` manually:
content = content.split('\`/${buildReportImageUrl(report.image_path)}\`').join('buildReportImageUrl(report.image_path)');
content = content.split('src="/${esc(buildReportImageUrl(report.image_path))}"').join('src="${esc(buildReportImageUrl(report.image_path))}"');

content = content.replace('preview.src = data.image_url;', 'preview.src = buildReportImageUrl(data.image_url);');
content = content.replace('src="${esc(report.image_url)}"', 'src="${esc(buildReportImageUrl(report.image_url))}"');
content = content.replace('src="${esc(data.image_url)}"', 'src="${esc(buildReportImageUrl(data.image_url))}"');

const oldPreviewUrl = 'const previewUrl = payload.image_url || (payload.image_path ? `/${buildReportImageUrl(payload.image_path)}` : "");';
const newPreviewUrl = 'const previewUrl = buildReportImageUrl(payload.image_url || payload.image_path);';
content = content.split(oldPreviewUrl).join(newPreviewUrl);

fs.writeFileSync(file, content);
console.log('done');
