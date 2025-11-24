// InfiniteGradientCarousel.tsx
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

type Props = {
    images?: string[];
};

function InfiniteGradientCarousel({ images }: Props) {
    // TODO: Implement carousel functionality
    return (
        <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">无限梯度轮播</h3>
            <p className="text-gray-600 mb-4">组件实现中...</p>
            <div className="text-sm text-gray-500">
                配置图片数量: {images?.length || 0}
            </div>
        </div>
    )
}

// Auto-register the component
const RegisteredInfiniteGradientCarousel = createAutoRegisterComponent({
  id: 'infinite-gradient-carousel',
  name: 'InfiniteGradientCarousel',
  description: '无限梯度轮播组件，支持自定义图片列表',
  category: CATEGORIES.MEDIA,
  template: `:::react{component="InfiniteGradientCarousel"}
:::`,
  tags: ['轮播', '媒体', '渐变'],
  version: '1.0.0',
})(InfiniteGradientCarousel)

export { RegisteredInfiniteGradientCarousel as InfiniteGradientCarousel }
