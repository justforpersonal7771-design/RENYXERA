/**
 * SQL practice set. The browser runs it on SQLite (the only SQL engine a free hosted runner offers), so a small shim turns the commonest
 * SQL Server habits into SQLite; each exercise also shows the SQL Server way. Checking runs the reference query on the same data and compares rows.
 */
export const SQL_SETUP = `
CREATE TABLE Customer (CustomerId INT PRIMARY KEY, Name TEXT NOT NULL, City TEXT NULL);
CREATE TABLE Orders (OrderId INT PRIMARY KEY, CustomerId INT NULL, OrderDate TEXT NOT NULL, Total REAL NOT NULL);
CREATE TABLE OrderLine (OrderId INT, Line INT, Product TEXT, Qty INT, Price REAL);
INSERT INTO Customer VALUES (1,'Asha','Pune'),(2,'Bilal','Delhi'),(3,'Chen',NULL),(4,'Dina','Pune'),(5,'Eli','Mumbai');
INSERT INTO Orders VALUES (100,1,'2026-01-05',250),(101,1,'2026-02-11',400),(102,2,'2026-02-12',150),(103,NULL,'2026-03-01',90),(104,4,'2026-03-09',700),(105,4,'2026-03-20',120);
INSERT INTO OrderLine VALUES (100,1,'Pen',10,5),(100,2,'Book',2,100),(101,1,'Bag',1,400),(102,1,'Pen',30,5),(104,1,'Bag',1,400),(104,2,'Book',3,100),(105,1,'Pen',24,5);
`;

/** T-SQL habits translated for SQLite. Deliberately small and listed to the learner, never silent magic. */
export function toSqlite(q: string): string {
  let s = q.replace(/\bdbo\./gi, "").replace(/\[(\w+)\]/g, '"$1"').replace(/\bISNULL\s*\(/gi, "IFNULL(").replace(/\bLEN\s*\(/gi, "LENGTH(").replace(/\bGETDATE\s*\(\s*\)/gi, "date('now')");
  const top = s.match(/\bSELECT\s+TOP\s*\(?\s*(\d+)\s*\)?\s+/i);
  if (top) { s = s.replace(top[0], "SELECT "); s = s.replace(/;?\s*$/, "") + ` LIMIT ${top[1]};`; }
  return s;
}

export type SqlExercise = { id: string; title: string; ask: string; hint: string; ref: string; tsql: string; ordered?: boolean };
export const SQL_EXERCISES: SqlExercise[] = [
  { id: "inner-join", title: "Orders with customer names", ask: "List Name and OrderId for every order that has a customer, ordered by Name then OrderId.", hint: "INNER JOIN on CustomerId. Order 103 has no customer, so it disappears.", ref: "SELECT c.Name, o.OrderId FROM Customer c INNER JOIN Orders o ON o.CustomerId = c.CustomerId ORDER BY c.Name, o.OrderId;", tsql: "Same in SQL Server (use dbo.Customer, dbo.Orders).", ordered: true },
  { id: "left-anti", title: "Customers who never ordered", ask: "List the Name of every customer with no orders, ordered by Name.", hint: "LEFT JOIN then keep rows where the order side IS NULL. NOT IN is dangerous when the subquery can return NULL.", ref: "SELECT c.Name FROM Customer c LEFT JOIN Orders o ON o.CustomerId = c.CustomerId WHERE o.OrderId IS NULL ORDER BY c.Name;", tsql: "Same. NOT EXISTS is the safest form in SQL Server too.", ordered: true },
  { id: "null-city", title: "NULL is not a value", ask: "List Name for customers whose City is NOT 'Pune', including those with no city. Order by Name.", hint: "City <> 'Pune' is unknown for NULL. Add OR City IS NULL.", ref: "SELECT Name FROM Customer WHERE City <> 'Pune' OR City IS NULL ORDER BY Name;", tsql: "Same. SQL Server also has ISNULL(City,'') <> 'Pune'.", ordered: true },
  { id: "group-having", title: "Big spenders", ask: "For each CustomerId with orders, show CustomerId and the sum of Total as Spent, only where Spent is over 300. Order by CustomerId.", hint: "GROUP BY CustomerId, then HAVING (not WHERE) filters the sums. Skip the NULL customer.", ref: "SELECT CustomerId, SUM(Total) AS Spent FROM Orders WHERE CustomerId IS NOT NULL GROUP BY CustomerId HAVING SUM(Total) > 300 ORDER BY CustomerId;", tsql: "Same.", ordered: true },
  { id: "top-n", title: "Top two orders", ask: "Show the OrderId and Total of the two largest orders, largest first.", hint: "ORDER BY Total DESC and limit to 2. Try writing it SQL Server style: SELECT TOP 2 ...", ref: "SELECT OrderId, Total FROM Orders ORDER BY Total DESC LIMIT 2;", tsql: "SELECT TOP (2) OrderId, Total FROM dbo.Orders ORDER BY Total DESC;  (or OFFSET 0 ROWS FETCH NEXT 2 ROWS ONLY)", ordered: true },
  { id: "line-total", title: "Revenue per product", ask: "For each Product show Product and SUM(Qty * Price) as Revenue, highest first.", hint: "Aggregate over an expression. Alias the result.", ref: "SELECT Product, SUM(Qty * Price) AS Revenue FROM OrderLine GROUP BY Product ORDER BY Revenue DESC;", tsql: "Same.", ordered: true },
  { id: "window-rank", title: "Rank each customer's orders", ask: "For orders with a customer, show OrderId, CustomerId and ROW_NUMBER() as rn, numbering each customer's orders by OrderDate. Order by CustomerId, rn.", hint: "ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY OrderDate).", ref: "SELECT OrderId, CustomerId, ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY OrderDate) AS rn FROM Orders WHERE CustomerId IS NOT NULL ORDER BY CustomerId, rn;", tsql: "Same in SQL Server.", ordered: true },
  { id: "cte-latest", title: "Latest order per customer", ask: "Show CustomerId and the OrderId of each customer's most recent order (by OrderDate). Order by CustomerId.", hint: "A CTE with ROW_NUMBER() ordered DESC, then keep rn = 1.", ref: "WITH x AS (SELECT OrderId, CustomerId, ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY OrderDate DESC) AS rn FROM Orders WHERE CustomerId IS NOT NULL) SELECT CustomerId, OrderId FROM x WHERE rn = 1 ORDER BY CustomerId;", tsql: "Same. This is the standard 'top 1 per group' answer.", ordered: true },
  { id: "subquery-avg", title: "Above-average orders", ask: "List OrderId for orders whose Total is above the average Total of all orders. Order by OrderId.", hint: "A scalar subquery: WHERE Total > (SELECT AVG(Total) FROM Orders).", ref: "SELECT OrderId FROM Orders WHERE Total > (SELECT AVG(Total) FROM Orders) ORDER BY OrderId;", tsql: "Same.", ordered: true },
  { id: "count-distinct", title: "Cities served", ask: "Show how many distinct non-NULL cities are in Customer, as Cities.", hint: "COUNT(DISTINCT City) ignores NULL on its own.", ref: "SELECT COUNT(DISTINCT City) AS Cities FROM Customer;", tsql: "Same." },
];
