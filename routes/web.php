<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use League\CommonMark\Node\Query\OrExpr;

// Route::get('/homePage', function () {
//     return Inertia::render('HomePage');
// });

Route::redirect('/', '/home-page');
Route::get('/home-page', function() {
    return Inertia::render('HomePage');
});

Route::get('/custom-design', function () {
    return Inertia::render('CustomTshirtDesigner');
})->name('custom-design');

Route::get('/sablon-logo', function () {
    return Inertia::render('SablonLogo');
})->name('sablon-logo');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
