import React from 'react'

export default function InstanceHeader () {
  return (
    <thead>
      <tr>
        <th style={{ width: '15%' }}>name</th>
        <th style={{ width: '15%' }} />
        <th style={{ width: '10%' }}>best</th>
        <th style={{ width: '10%' }}>finalized</th>
        <th style={{ width: '40%' }}>node identity</th>
        <th style={{ width: '10%', textAlign: 'right' }}></th>
      </tr>
    </thead>
  )
}