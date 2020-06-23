import React, { useState, useEffect } from 'react'
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

export interface Filter {
  op: 'equal' | 'contains' | 'between' | 'in' | 'null' | 'not_null'
  column: string
  values: any[]
}

export interface PageQueryParams {
  // eslint-disable-next-line camelcase
  range?: string
  sort?: string
  filter?: string
}

const getQueryParams = (
  currentPage: number,
  pageSize: number,
  sorting: Sorting[],
  filter?: Filter[]
): PageQueryParams => {
  const rangeQ = JSON.stringify([
    pageSize * currentPage,
    pageSize * (currentPage + 1),
  ] as number[])

  const columnSorting = sorting[0]
  let sortQ = ''
  if (columnSorting) {
    const sortingDirectionString =
      columnSorting.direction === 'desc' ? ' desc' : 'asc'
    sortQ = JSON.stringify({
      field: columnSorting.columnName,
      order: sortingDirectionString,
    })
  }
  let filterQ: string | undefined
  if (filter) {
    filterQ = JSON.stringify(filter)
  }

  return { range: rangeQ, sort: sortQ, filter: filterQ }
}

export interface PaginateGridProps extends GridProps {
  defaultSorting?: Sorting
  sortingStateColumnExtensions?: SortingState.ColumnExtension[]
  totalCount: number
  filter?: Filter[]
  onChangePage: (params: PageQueryParams) => void
}
export const PaginateGrid: React.FC<PaginateGridProps> = ({
  defaultSorting,
  sortingStateColumnExtensions,
  totalCount,
  filter,
  onChangePage,
  children,
  ...rest
}) => {
  const [sorting, setSorting] = useState<Sorting[]>([
    defaultSorting || { columnName: 'id', direction: 'desc' },
  ])
  const [pageSize, setPageSize] = useState(15)
  const [pageSizes] = useState([15, 30, 50, 100])
  const [currentPage, setCurrentPage] = useState(0)

  const handleChangePageSize = (value: number) => {
    const totalPages = Math.ceil(totalCount / value)
    const updatedCurrentPage = Math.min(currentPage, totalPages - 1)

    setPageSize(value)
    setCurrentPage(updatedCurrentPage)

    const p = getQueryParams(updatedCurrentPage, value, sorting, filter)
    onChangePage(p)
  }

  const handleChangeCurrentPage = (currentPage: number) => {
    setCurrentPage(currentPage)
    const p = getQueryParams(currentPage, pageSize, sorting, filter)
    onChangePage(p)
  }

  const handleChangeSorting = (sorting: Sorting[]) => {
    setSorting(sorting)
    const p = getQueryParams(currentPage, pageSize, sorting, filter)
    onChangePage(p)
  }

  useEffect(() => {
    const p = getQueryParams(currentPage, pageSize, sorting, filter)
    onChangePage(p)
  }, [filter])

  return (
    <Grid {...rest}>
      {children}
      <SortingState
        sorting={sorting}
        columnExtensions={sortingStateColumnExtensions}
        onSortingChange={handleChangeSorting}
      />
      <PagingState
        currentPage={currentPage}
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
