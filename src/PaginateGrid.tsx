import React from 'react'
import {
  PagingState,
  SortingState,
  CustomPaging,
  Sorting,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  GridProps,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui'

export interface PageDefinition {
  // eslint-disable-next-line camelcase
  page: number
  pageSize: number
  sorting?: Sorting
}

export interface PaginateGridProps extends GridProps {
  pageSizes?: number[]
  pageDef: PageDefinition | undefined
  sortingStateColumnExtensions?: SortingState.ColumnExtension[]
  totalCount: number
  onChangePage: (pageDef: PageDefinition) => void
}
export const PaginateGrid: React.FC<PaginateGridProps> = ({
  sortingStateColumnExtensions,
  totalCount,
  pageDef,
  onChangePage,
  children,
  ...rest
}) => {
  const sorting: Sorting =
    pageDef && pageDef.sorting
      ? pageDef.sorting
      : { columnName: 'id', direction: 'desc' }
  const pageSizes = rest.pageSizes || [15, 30, 50, 100]
  const pageSize =
    pageDef && pageDef.pageSize && pageSizes.includes(pageDef.pageSize)
      ? pageDef.pageSize
      : 15

  const page = pageDef && pageDef.page ? pageDef.page : 0

  const handleChangePageSize = (value: number) => {
    const totalPages = Math.ceil(totalCount / value)
    const updatedCurrentPage = Math.min(page, totalPages - 1)

    onChangePage({ sorting, pageSize: value, page: updatedCurrentPage })
  }

  const handleChangeCurrentPage = (currentPage: number) => {
    onChangePage({ sorting, pageSize, page: currentPage })
  }

  const handleChangeSorting = (sorting: Sorting[]) => {
    onChangePage({ pageSize, page, sorting: sorting[0] })
  }

  return (
    <Grid {...rest}>
      {children}
      <SortingState
        sorting={[sorting]}
        columnExtensions={sortingStateColumnExtensions}
        onSortingChange={handleChangeSorting}
      />
      <PagingState
        currentPage={page}
        onCurrentPageChange={handleChangeCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handleChangePageSize}
      />
      <CustomPaging totalCount={totalCount} />
      <TableHeaderRow showSortingControls />
      <PagingPanel pageSizes={pageSizes} />
    </Grid>
  )
}
