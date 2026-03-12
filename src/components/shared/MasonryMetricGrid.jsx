import { Masonry } from 'masonic'

function MasonryMetricItem ({ data }) {
  return <div className='w-full'>{data.content}</div>
}

export function MasonryMetricGrid ({
  items,
  columnWidth = 260,
  maxColumnCount,
  itemHeightEstimate = 260
}) {
  return (
    <Masonry
      items={items}
      render={MasonryMetricItem}
      itemKey={(item) => item.id}
      columnWidth={columnWidth}
      columnGutter={12}
      rowGutter={12}
      maxColumnCount={maxColumnCount}
      itemHeightEstimate={itemHeightEstimate}
      overscanBy={1.5}
      role='list'
      tabIndex={-1}
      className='masonry-metric-grid'
    />
  )
}
