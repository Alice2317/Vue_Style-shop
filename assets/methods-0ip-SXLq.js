function a(r){return`${parseInt(r,10).toFixed(0).replace(/./g,(e,n,t)=>n&&e!=="."&&(t.length-n)%3===0?`, ${e}`.replace(/\s/g,""):e)}`}export{a as c};
