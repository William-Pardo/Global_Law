# Script para limpiar el repositorio manteniendo archivos de Git
Write-Host "Limpiando repositorio..." -ForegroundColor Yellow

# Archivos y carpetas a mantener
$keepItems = @('.git', '.gitignore', 'clean_repo.ps1')

# Obtener todos los elementos excepto los que queremos mantener
$itemsToRemove = Get-ChildItem -Force | Where-Object { 
    $keepItems -notcontains $_.Name 
}

# Mostrar qué se va a eliminar
Write-Host "Se eliminarán los siguientes archivos y carpetas:" -ForegroundColor Red
$itemsToRemove | ForEach-Object { Write-Host "  - $($_.Name)" }

# Pedir confirmación
$confirmation = Read-Host "¿Estás seguro de que quieres eliminar estos archivos? (s/n)"

if ($confirmation -eq 's' -or $confirmation -eq 'S' -or $confirmation -eq 'si' -or $confirmation -eq 'SI') {
    try {
        $itemsToRemove | Remove-Item -Recurse -Force
        Write-Host "✅ Repositorio limpiado exitosamente!" -ForegroundColor Green
        Write-Host "Archivos mantenidos:" -ForegroundColor Green
        Get-ChildItem -Force | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Green }
    }
    catch {
        Write-Host "❌ Error al eliminar archivos: $($_.Exception.Message)" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Operación cancelada." -ForegroundColor Yellow
}

Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
