import React, { Children } from 'react'
import { get } from '@/shared'
export const icon = (src) => (
  <span style={{ paddingTop: '1px' }}>
    < img src={src} />
  </span>
)
export const menu = async () => {
  const resources = [
    {
      "id": "11187059925811200",
      "name": "AI电话纪要",
      "code": null,
      "ids": null,
      // "menuIcon": <AppstoreOutlined />,
      "path": "/main/aiMeetingMinutes",
      "paths": null,
      "parentId": null,
      "type": 1,
      "sort": 1,
      "level": 1,
      "children": null,
      "pageIndex": null,
      "pageSize": null
    },
    {
      "id": "11187059925811201",
      "name": "模板配置",
      "code": null,
      "ids": null,
      // "menuIcon": <AppstoreOutlined />,
      "path": "/main/templateConfiguration",
      "paths": null,
      "parentId": null,
      "type": 1,
      "sort": 1,
      "level": 1,
      "children": null,
      "pageIndex": null,
      "pageSize": null
    }
  ]
  return resources
}