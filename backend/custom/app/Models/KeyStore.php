<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeyStore extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'value',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
