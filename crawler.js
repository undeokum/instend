const axios = require('axios')
const fs = require('fs')
const path = require('path')

const apiKey = 'AIzaSyBjJ0L_ot27wRhlTI4ETpopl2HRe57oB3A' // 여기에 본인 API키 넣기

const locations = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
  '충청북도', '충청남도', '전라북도', '전라남도', '경상북도',
  '경상남도', '제주특별자치도'
]

async function fetchPlacesByLocation(location) {
  const keyword = `${location} 맛집`
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${apiKey}`

  try {
    const res = await axios.get(url)
    return res.data.results
  } catch (error) {
    console.error(`${location} API 요청 실패:`, error.response?.data || error.message)
    return []
  }
}

async function main() {
  for (const loc of locations) {
    console.log(`📍 ${loc} 맛집 크롤링 중...`)
    const results = await fetchPlacesByLocation(loc)

    const filename = `${locations.indexOf(loc)}.json`
    fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(results, null, 2), 'utf-8')

    console.log(`✅ ${filename} 저장 완료`)
    await new Promise(resolve => setTimeout(resolve, 2000)) // API 요청 속도 제한을 위해 2초 대기
  }
}

main()
