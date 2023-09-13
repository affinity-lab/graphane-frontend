Get-ChildItem -Directory | Where-Object { $_.FullName -notlike '*\@*' -and $_.FullName -notlike '*\.*' -and $_.Name -ne 'node_modules' } | ForEach-Object { Remove-Item -Recurse $_.FullName }
tsc