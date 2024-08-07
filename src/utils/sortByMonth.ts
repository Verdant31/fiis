export const sortByMonth = (arr: any[]) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return arr.sort(function(a, b){
    return months.indexOf(a) - months.indexOf(b);
  });
}