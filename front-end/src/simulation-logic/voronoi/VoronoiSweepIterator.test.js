import VoronoiSweepIterator from './VoronoiSweepIterator';

test('returns one renderable frame per site',()=>{
  const points=[{x:2,y:5},{x:8,y:5},{x:5,y:8}];
  const iterator=new VoronoiSweepIterator(points,{minX:0,maxX:10,minY:0,maxY:10});
  const frames=[]; while(iterator.hasNext()) frames.push(iterator.next());
  expect(frames).toHaveLength(3);
  expect(frames[2].complete).toBe(true);
  expect(frames[2].cells).toHaveLength(3);
  expect(frames.every(frame=>frame.cells.every(cell=>cell.polygon.length>=3))).toBe(true);
  expect(()=>iterator.next()).toThrow(RangeError);
});
