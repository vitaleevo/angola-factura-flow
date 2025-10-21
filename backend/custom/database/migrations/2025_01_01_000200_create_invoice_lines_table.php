<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoice_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->string('description', 255);
            $table->decimal('qty', 18, 3);
            $table->decimal('unit_price', 18, 4);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('line_net', 18, 2);
            $table->decimal('line_tax', 18, 2);
            $table->decimal('line_total', 18, 2);
            $table->timestamps();
            $table->foreign('invoice_id')
                ->references('id')
                ->on('invoices')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_lines');
    }
};
