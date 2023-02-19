import { Plugin } from "chart.js";

export const bubbleOutline: Plugin = {
    id: "bubbleOutline",
    afterDraw: c => {
        let datasets = c.data.datasets;
        datasets.forEach((e, i) => {
           let isHidden = e.hidden;
           if (!isHidden) {
              let data = c.getDatasetMeta(i).data;
              data.forEach(e => {
                let ctx = c.ctx;
                let x = e.x;
                let y = e.y;
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 3]);
                ctx.arc(x, y, 10, 0, 2 * Math.PI);
                ctx.strokeStyle = "#808080";
                ctx.stroke();
                ctx.restore();
              });
           }
        });
     }
};